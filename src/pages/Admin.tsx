import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  migrateCoursesToFirebase,
  updateCourseInFirebase,
  getAllCoursesFromFirebase,
  bulkUpdateZoomLinks,
  createCourseInFirebase,
  deleteCourseFromFirebase,
  getAllUsersFromFirebase,
  updateUserInFirebase,
  createUserProfileInFirebase,
} from "@/firebase/migration";
import type { Course, User, CourseProgress, ScheduleItem, Note, Announcement, SyllabusItem, QuizQuestion } from "@/types/firebase";
import { Loader2, Save, RefreshCw, Link, Calendar, Users, BookOpen, Plus, Edit2, Trash2, UserPlus, CheckCircle2, Video, FileText, Megaphone } from "lucide-react";
import CourseEditor from "@/components/CourseEditor";
import { onSnapshot } from "firebase/firestore";
import { usersCollection } from "@/firebase/firestore";
import { auth } from "@/firebase/auth";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const Admin = () => {
  const { user, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const [courses, setCourses] = useState<Course[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [usersLoading, setUsersLoading] = useState(true);
  const [usersError, setUsersError] = useState<string | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [bulkZoomLinks, setBulkZoomLinks] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState("dashboard");
  const [newCourse, setNewCourse] = useState({
    id: "",
    title: "",
    description: "",
    instructor: "",
    thumbnail: "",
    duration: "6 Weeks",
    level: "Beginner" as "Beginner" | "Intermediate",
    category: "General",
    price: 0,
    totalClasses: 12,
    capacity: 100,
  });
  const [newUser, setNewUser] = useState({ uid: "", name: "", email: "" });
  const [userCourseSelection, setUserCourseSelection] = useState<Record<string, string>>({});
  const [manualProgressByUser, setManualProgressByUser] = useState<Record<string, number>>({});
  
  // Edit state
  const [editingSchedule, setEditingSchedule] = useState<ScheduleItem | null>(null);
  const [editingSyllabus, setEditingSyllabus] = useState<SyllabusItem | null>(null);
  const [editingQuestion, setEditingQuestion] = useState<QuizQuestion | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [newScheduleItem, setNewScheduleItem] = useState<Omit<ScheduleItem, "id">>({
    topic: "",
    date: "",
    time: "",
    status: "upcoming",
    meetLink: "",
    recordingUrl: "",
  });
  const [newNote, setNewNote] = useState<Omit<Note, "id">>({
    title: "",
    description: "",
    fileUrl: "",
    type: "pdf",
  });
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [newAnnouncement, setNewAnnouncement] = useState<Omit<Announcement, "id">>({
    title: "",
    message: "",
    date: new Date().toISOString().slice(0, 10),
    priority: "normal",
  });
  const [editingAnnouncementId, setEditingAnnouncementId] = useState<string | null>(null);

  // Allow access to admin users (can be expanded)
  const adminEmails = [
    "raminisaisanthosh@gmail.com",
    "srijithakattekola2028@gmail.com",
    "saisanthosh26082007@gmail.com",
  ];
  const allowAllAuthedAdmin = import.meta.env.VITE_ALLOW_ALL_AUTHENTICATED_ADMIN === "true";
  const isAdmin = (allowAllAuthedAdmin && !!user) || adminEmails.includes(user?.email || "") || user?.role === "admin" || user?.uid === "admin-user-id";

  useEffect(() => {
    if (isAdmin) {
      loadCourses();
    }
  }, [isAdmin]);

  useEffect(() => {
    if (!selectedCourse) return;
    const freshSelected = courses.find((course) => course.id === selectedCourse.id);
    if (freshSelected) {
      setSelectedCourse(freshSelected);
    }
  }, [courses, selectedCourse]);

  useEffect(() => {
    if (authLoading || !isAdmin) {
      return;
    }

    let unsubscribe: (() => void) | undefined;
    let isMounted = true;

    const startUsersSync = async () => {
      setUsersLoading(true);
      try {
        const currentUser = auth.currentUser;
        if (!currentUser) {
          if (!isMounted) return;
          setUsers([]);
          setUsersError("No authenticated user session. Please log out and log in again.");
          setUsersLoading(false);
          return;
        }

        // Force a fresh token to avoid stale-session permission failures.
        await currentUser.getIdToken(true);

        if (!isMounted) return;
        unsubscribe = onSnapshot(
          usersCollection,
          (snapshot) => {
            const firebaseUsers: User[] = snapshot.docs.map((docSnap) => ({
              uid: docSnap.id,
              ...(docSnap.data() as Omit<User, "uid">),
            }));

            setUsers(firebaseUsers);
            setUsersError(null);
            setUsersLoading(false);
          },
          (error: unknown) => {
            console.error("Error syncing users:", error);
            if (!isMounted) return;
            setUsers([]);
            const code = typeof error?.code === "string" ? ` (${error.code})` : "";
            const message = error instanceof Error ? error.message : "Failed to read users collection";
            setUsersError(`${message}${code}`);
            setUsersLoading(false);
          }
        );
      } catch (error: unknown) {
        console.error("Failed to initialize users sync:", error);
        if (!isMounted) return;
        setUsers([]);
        const code = typeof error?.code === "string" ? ` (${error.code})` : "";
        const message = error instanceof Error ? error.message : "Failed to initialize users sync";
        setUsersError(`${message}${code}`);
        setUsersLoading(false);
      }
    };

    void startUsersSync();

    return () => {
      isMounted = false;
      unsubscribe?.();
    };
  }, [authLoading, isAdmin]);

  const loadCourses = async () => {
    setLoading(true);
    const firebaseCourses = await getAllCoursesFromFirebase();
    setCourses(firebaseCourses);
    setLoading(false);
  };

  const loadUsers = async () => {
    try {
      const firebaseUsers = await getAllUsersFromFirebase();
      setUsers(firebaseUsers);
      setUsersError(null);
    } catch (error) {
      console.error("Manual user reload failed:", error);
      setUsers([]);
      setUsersError(error instanceof Error ? error.message : "Failed to read users collection");
    }
  };

  const normalizeCourseId = (value: string) =>
    value
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-");

  const handleMigrateToFirebase = async () => {
    setLoading(true);
    const result = await migrateCoursesToFirebase();
    if (result.success) {
      toast({
        title: "Migration Successful",
        description: "All courses have been moved to Firebase",
      });
      loadCourses();
    } else {
      toast({
        title: "Migration Failed",
        description: result.message,
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  const handleUpdateCourse = async (courseId: string, updates: Partial<Course>) => {
    const result = await updateCourseInFirebase(courseId, updates);
    if (result.success) {
      toast({
        title: "Course Updated",
        description: `Course updated successfully`,
      });
      loadCourses();
    } else {
      toast({
        title: "Update Failed",
        description: result.message,
        variant: "destructive",
      });
    }
  };

  const handleBulkUpdateZoom = async () => {
    setLoading(true);
    const result = await bulkUpdateZoomLinks(bulkZoomLinks);
    if (result.success) {
      toast({
        title: "Bulk Update Successful",
        description: "All Zoho Webinar links have been updated",
      });
      loadCourses();
      setBulkZoomLinks({});
    } else {
      toast({
        title: "Bulk Update Failed",
        description: result.message,
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  const handleCreateCourse = async () => {
    if (!newCourse.title.trim()) {
      toast({
        title: "Missing title",
        description: "Please enter a course title.",
        variant: "destructive",
      });
      return;
    }

    const id = normalizeCourseId(newCourse.id || newCourse.title);
    if (!id) {
      toast({
        title: "Invalid course ID",
        description: "Enter a valid title or ID.",
        variant: "destructive",
      });
      return;
    }

    const payload: Course = {
      id,
      title: newCourse.title,
      description: newCourse.description || "Course description",
      instructor: newCourse.instructor || "Instructor",
      thumbnail: newCourse.thumbnail || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&auto=format&fit=crop",
      duration: newCourse.duration,
      level: newCourse.level,
      progress: 0,
      schedule: [],
      notes: [],
      announcements: [],
      totalClasses: Math.max(1, Number(newCourse.totalClasses) || 1),
      completedClasses: 0,
      category: newCourse.category || "General",
      price: Math.max(0, Number(newCourse.price) || 0),
      capacity: Math.max(1, Number(newCourse.capacity) || 1),
      enrolledCount: 0,
      isPaid: true,
    };

    setLoading(true);
    const result = await createCourseInFirebase(payload);
    if (result.success) {
      toast({
        title: "Course created",
        description: "New course is live in Firebase.",
      });
      setNewCourse({
        id: "",
        title: "",
        description: "",
        instructor: "",
        thumbnail: "",
        duration: "6 Weeks",
        level: "Beginner",
        category: "General",
        price: 0,
        totalClasses: 12,
        capacity: 100,
      });
      await loadCourses();
    } else {
      toast({
        title: "Create failed",
        description: result.message,
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  const handleDeleteCourse = async (courseId: string) => {
    setLoading(true);
    const result = await deleteCourseFromFirebase(courseId);
    if (result.success) {
      toast({ title: "Course deleted", description: "Course removed from Firebase." });
      if (selectedCourse?.id === courseId) setSelectedCourse(null);
      await loadCourses();
    } else {
      toast({ title: "Delete failed", description: result.message, variant: "destructive" });
    }
    setLoading(false);
  };

  const handleCreateUser = async () => {
    if (!newUser.uid.trim() || !newUser.email.trim()) {
      toast({
        title: "Missing fields",
        description: "UID and email are required.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    const result = await createUserProfileInFirebase({
      uid: newUser.uid.trim(),
      name: newUser.name.trim() || "Student",
      email: newUser.email.trim(),
      role: "student",
    });

    if (result.success) {
      toast({ title: "User profile created", description: "User saved in Firebase users collection." });
      setNewUser({ uid: "", name: "", email: "" });
      await loadUsers();
    } else {
      toast({ title: "Create failed", description: result.message, variant: "destructive" });
    }
    setLoading(false);
  };

  const buildProgress = (existing: CourseProgress | undefined, totalClasses: number, percentage: number): CourseProgress => {
    const safePercent = Math.max(0, Math.min(100, Math.round(percentage)));
    const completedClasses = Math.round((safePercent / 100) * totalClasses);
    const completed = safePercent >= 100;
    const prevQuiz = existing?.quizScore ?? 0;
    const quizScore = completed ? Math.max(60, prevQuiz) : prevQuiz;

    return {
      completedClasses,
      totalClasses,
      quizScore,
      completed,
      certificateDate: completed ? existing?.certificateDate || new Date().toISOString() : existing?.certificateDate,
      isPaid: true,
      completedLessons: completed ? [] : existing?.completedLessons || [],
    };
  };

  const handleAssignCourseOnly = async (targetUser: User) => {
    const selectedCourseId = userCourseSelection[targetUser.uid];
    if (!selectedCourseId) {
      toast({ title: "Select a course", description: "Pick a course before assigning.", variant: "destructive" });
      return;
    }

    const course = courses.find((c) => c.id === selectedCourseId);
    if (!course) {
      toast({ title: "Course not found", description: "Selected course no longer exists.", variant: "destructive" });
      return;
    }

    const enrolledCourses = Array.from(new Set([...(targetUser.enrolledCourses || []), selectedCourseId]));
    const paidCourses = Array.from(new Set([...(targetUser.paidCourses || []), selectedCourseId]));

    const result = await updateUserInFirebase(targetUser.uid, {
      enrolledCourses,
      paidCourses,
    });

    if (result.success) {
      toast({
        title: "Course assigned",
        description: `${targetUser.name} has been assigned ${course.title}.`,
      });
      await loadUsers();
    } else {
      toast({ title: "Assign failed", description: result.message, variant: "destructive" });
    }
  };

  const handleUpdateCourseProgress = async (targetUser: User, forceHundred = false) => {
    const selectedCourseId = userCourseSelection[targetUser.uid];
    if (!selectedCourseId) {
      toast({ title: "Select a course", description: "Pick a course before updating progress.", variant: "destructive" });
      return;
    }

    const course = courses.find((c) => c.id === selectedCourseId);
    if (!course) {
      toast({ title: "Course not found", description: "Selected course no longer exists.", variant: "destructive" });
      return;
    }

    const percentage = forceHundred ? 100 : Math.max(0, Math.min(100, Number(manualProgressByUser[targetUser.uid] ?? 0)));
    const existingProgress = targetUser.progress?.[selectedCourseId];
    const nextProgress = buildProgress(existingProgress, Math.max(1, course.totalClasses || 1), percentage);

    const result = await updateUserInFirebase(targetUser.uid, {
      [`progress.${selectedCourseId}`]: nextProgress,
    });

    if (result.success) {
      toast({
        title: forceHundred ? "User marked complete" : "User progress updated",
        description: `${targetUser.name} now has ${percentage}% in ${course.title}.`,
      });
      await loadUsers();
    } else {
      toast({ title: "Update failed", description: result.message, variant: "destructive" });
    }
  };

  // Edit handlers
  const handleEditSchedule = (item: ScheduleItem) => {
    setEditingSchedule({ ...item });
    setShowEditDialog(true);
  };

  const makeId = (prefix: string) => `${prefix}-${Date.now()}`;

  const handleSaveSchedule = () => {
    if (!selectedCourse || !editingSchedule) return;
    
    const updatedSchedule = selectedCourse.schedule?.map(s => 
      s.id === editingSchedule.id ? editingSchedule : s
    ) || [];
    
    const updatedCourse = { ...selectedCourse, schedule: updatedSchedule };
    handleUpdateCourse(selectedCourse.id, { schedule: updatedSchedule });
    
    setShowEditDialog(false);
    setEditingSchedule(null);
    toast({
      title: "Schedule Updated",
      description: "Class schedule has been updated successfully",
    });
  };

  const handleAddScheduleSession = async () => {
    if (!selectedCourse) {
      toast({ title: "Select a course", description: "Choose a course first.", variant: "destructive" });
      return;
    }

    if (!newScheduleItem.topic.trim() || !newScheduleItem.date || !newScheduleItem.time) {
      toast({ title: "Missing fields", description: "Topic, date and time are required.", variant: "destructive" });
      return;
    }

    const nextSchedule: ScheduleItem[] = [
      ...(selectedCourse.schedule || []),
      {
        id: makeId("class"),
        topic: newScheduleItem.topic.trim(),
        date: newScheduleItem.date,
        time: newScheduleItem.time,
        status: newScheduleItem.status,
        meetLink: newScheduleItem.meetLink?.trim() || undefined,
        recordingUrl: newScheduleItem.recordingUrl?.trim() || undefined,
      },
    ];

    await handleUpdateCourse(selectedCourse.id, { schedule: nextSchedule });
    setNewScheduleItem({ topic: "", date: "", time: "", status: "upcoming", meetLink: "", recordingUrl: "" });
  };

  const handleDeleteScheduleSession = async (sessionId: string) => {
    if (!selectedCourse) return;
    const nextSchedule = (selectedCourse.schedule || []).filter((session) => session.id !== sessionId);
    await handleUpdateCourse(selectedCourse.id, { schedule: nextSchedule });
  };

  const handleEditSyllabus = (item: SyllabusItem) => {
    setEditingSyllabus({ ...item });
    setShowEditDialog(true);
  };

  const handleSaveSyllabus = () => {
    if (!selectedCourse || !editingSyllabus) return;
    
    const updatedSyllabus = selectedCourse.syllabus?.map(s => 
      s.week === editingSyllabus.week ? editingSyllabus : s
    ) || [];
    
    handleUpdateCourse(selectedCourse.id, { syllabus: updatedSyllabus });
    
    setShowEditDialog(false);
    setEditingSyllabus(null);
    toast({
      title: "Syllabus Updated",
      description: "Course syllabus has been updated successfully",
    });
  };

  const handleEditQuestion = (item: QuizQuestion) => {
    setEditingQuestion({ ...item });
    setShowEditDialog(true);
  };

  const handleSaveQuestion = () => {
    if (!selectedCourse || !editingQuestion) return;
    
    const updatedQuestions = selectedCourse.finalQuiz?.questions?.map(q => 
      q.id === editingQuestion.id ? editingQuestion : q
    ) || [];
    
    const updatedQuiz = { ...(selectedCourse.finalQuiz || {}), questions: updatedQuestions };
    handleUpdateCourse(selectedCourse.id, { finalQuiz: updatedQuiz });
    
    setShowEditDialog(false);
    setEditingQuestion(null);
    toast({
      title: "Question Updated",
      description: "Quiz question has been updated successfully",
    });
  };

  const resetNoteForm = () => {
    setEditingNoteId(null);
    setNewNote({ title: "", description: "", fileUrl: "", type: "pdf" });
  };

  const handleSaveNote = async () => {
    if (!selectedCourse) {
      toast({ title: "Select a course", description: "Choose a course first.", variant: "destructive" });
      return;
    }
    if (!newNote.title.trim() || !newNote.fileUrl.trim()) {
      toast({ title: "Missing fields", description: "Note title and URL are required.", variant: "destructive" });
      return;
    }

    const notePayload: Note = {
      id: editingNoteId || makeId("note"),
      title: newNote.title.trim(),
      description: newNote.description.trim(),
      fileUrl: newNote.fileUrl.trim(),
      type: newNote.type,
    };

    const existingNotes = selectedCourse.notes || [];
    const nextNotes = editingNoteId
      ? existingNotes.map((note) => (note.id === editingNoteId ? notePayload : note))
      : [...existingNotes, notePayload];

    await handleUpdateCourse(selectedCourse.id, { notes: nextNotes });
    toast({ title: editingNoteId ? "Note updated" : "Note added", description: "Course notes have been saved." });
    resetNoteForm();
  };

  const handleEditNote = (note: Note) => {
    setEditingNoteId(note.id);
    setNewNote({
      title: note.title,
      description: note.description,
      fileUrl: note.fileUrl,
      type: note.type,
    });
  };

  const handleDeleteNote = async (noteId: string) => {
    if (!selectedCourse) return;
    const nextNotes = (selectedCourse.notes || []).filter((note) => note.id !== noteId);
    await handleUpdateCourse(selectedCourse.id, { notes: nextNotes });
    if (editingNoteId === noteId) resetNoteForm();
    toast({ title: "Note deleted", description: "Course note removed successfully." });
  };

  const resetAnnouncementForm = () => {
    setEditingAnnouncementId(null);
    setNewAnnouncement({
      title: "",
      message: "",
      date: new Date().toISOString().slice(0, 10),
      priority: "normal",
    });
  };

  const handleSaveAnnouncement = async () => {
    if (!selectedCourse) {
      toast({ title: "Select a course", description: "Choose a course first.", variant: "destructive" });
      return;
    }
    if (!newAnnouncement.title.trim() || !newAnnouncement.message.trim()) {
      toast({ title: "Missing fields", description: "Announcement title and message are required.", variant: "destructive" });
      return;
    }

    const announcementPayload: Announcement = {
      id: editingAnnouncementId || makeId("ann"),
      title: newAnnouncement.title.trim(),
      message: newAnnouncement.message.trim(),
      date: newAnnouncement.date || new Date().toISOString().slice(0, 10),
      priority: newAnnouncement.priority,
    };

    const existingAnnouncements = selectedCourse.announcements || [];
    const nextAnnouncements = editingAnnouncementId
      ? existingAnnouncements.map((announcement) =>
          announcement.id === editingAnnouncementId ? announcementPayload : announcement
        )
      : [...existingAnnouncements, announcementPayload];

    await handleUpdateCourse(selectedCourse.id, { announcements: nextAnnouncements });
    toast({
      title: editingAnnouncementId ? "Announcement updated" : "Announcement added",
      description: "Course announcement saved successfully.",
    });
    resetAnnouncementForm();
  };

  const handleEditAnnouncement = (announcement: Announcement) => {
    setEditingAnnouncementId(announcement.id);
    setNewAnnouncement({
      title: announcement.title,
      message: announcement.message,
      date: announcement.date,
      priority: announcement.priority,
    });
  };

  const handleDeleteAnnouncement = async (announcementId: string) => {
    if (!selectedCourse) return;
    const nextAnnouncements = (selectedCourse.announcements || []).filter((announcement) => announcement.id !== announcementId);
    await handleUpdateCourse(selectedCourse.id, { announcements: nextAnnouncements });
    if (editingAnnouncementId === announcementId) resetAnnouncementForm();
    toast({ title: "Announcement deleted", description: "Announcement removed successfully." });
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">You don't have permission to access the admin panel. Contact administrator to enable admin access.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-primary/5 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold font-display">Admin Dashboard</h1>
            <p className="text-muted-foreground mt-1">Manage courses, users, enrollments, and platform settings</p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={async () => {
                setLoading(true);
                await Promise.all([loadCourses(), loadUsers()]);
                setLoading(false);
              }}
              variant="outline"
              disabled={loading}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button onClick={handleMigrateToFirebase} disabled={loading} className="gradient-bg">
              <Save className="w-4 h-4 mr-2" />
              Migrate to Firebase
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-7 lg:grid-cols-7">
            <TabsTrigger value="dashboard" className="text-xs">Dashboard</TabsTrigger>
            <TabsTrigger value="courses" className="text-xs">Courses</TabsTrigger>
            <TabsTrigger value="syllabus" className="text-xs">Syllabus</TabsTrigger>
            <TabsTrigger value="schedules" className="text-xs">Schedules</TabsTrigger>
            <TabsTrigger value="content" className="text-xs">Content</TabsTrigger>
            <TabsTrigger value="quizzes" className="text-xs">Quizzes</TabsTrigger>
            <TabsTrigger value="users" className="text-xs">Users</TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="gradient-border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{courses.length}</div>
                  <p className="text-xs text-muted-foreground mt-2">Active courses in system</p>
                </CardContent>
              </Card>
              
              <Card className="gradient-border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Total Enrollments</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {courses.reduce((sum, course) => sum + (course.enrolledCount || 0), 0)}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">Students across all courses</p>
                </CardContent>
              </Card>

              <Card className="gradient-border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Active Courses</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {courses.filter(course => (course.enrolledCount || 0) > 0).length}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">With enrolled students</p>
                </CardContent>
              </Card>

              <Card className="gradient-border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Revenue Potential</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    ₹{(courses.reduce((sum, course) => sum + (course.enrolledCount || 0) * course.price, 0)).toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">From current enrollments</p>
                </CardContent>
              </Card>
            </div>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Course Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {courses.slice(0, 5).map((course) => (
                    <div key={course.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                      <div className="flex-1">
                        <p className="font-semibold">{course.title}</p>
                        <div className="flex gap-2 mt-1">
                          <Badge variant="outline">{course.category}</Badge>
                          <Badge variant="secondary" className="text-xs">{course.enrolledCount || 0} students</Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg">₹{course.price}</p>
                        <p className="text-xs text-muted-foreground">{course.level}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Courses Tab */}
          <TabsContent value="courses" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Manage Courses</h2>
              <Button className="gradient-bg gap-2" onClick={handleCreateCourse} disabled={loading}>
                <Plus className="w-4 h-4" />
                Add New Course
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Create Course</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                <Input
                  placeholder="Course title"
                  value={newCourse.title}
                  onChange={(e) => setNewCourse((prev) => ({ ...prev, title: e.target.value }))}
                />
                <Input
                  placeholder="Course ID (optional)"
                  value={newCourse.id}
                  onChange={(e) => setNewCourse((prev) => ({ ...prev, id: e.target.value }))}
                />
                <Input
                  placeholder="Instructor"
                  value={newCourse.instructor}
                  onChange={(e) => setNewCourse((prev) => ({ ...prev, instructor: e.target.value }))}
                />
                <Input
                  placeholder="Category"
                  value={newCourse.category}
                  onChange={(e) => setNewCourse((prev) => ({ ...prev, category: e.target.value }))}
                />
                <Input
                  type="number"
                  placeholder="Price"
                  value={newCourse.price}
                  onChange={(e) => setNewCourse((prev) => ({ ...prev, price: Number(e.target.value) || 0 }))}
                />
                <Input
                  type="number"
                  placeholder="Total classes"
                  value={newCourse.totalClasses}
                  onChange={(e) => setNewCourse((prev) => ({ ...prev, totalClasses: Number(e.target.value) || 1 }))}
                />
                <Input
                  type="number"
                  placeholder="Capacity"
                  value={newCourse.capacity}
                  onChange={(e) => setNewCourse((prev) => ({ ...prev, capacity: Number(e.target.value) || 1 }))}
                />
                <Input
                  placeholder="Thumbnail URL"
                  value={newCourse.thumbnail}
                  onChange={(e) => setNewCourse((prev) => ({ ...prev, thumbnail: e.target.value }))}
                />
                <div className="md:col-span-2 lg:col-span-4">
                  <Textarea
                    placeholder="Course description"
                    value={newCourse.description}
                    onChange={(e) => setNewCourse((prev) => ({ ...prev, description: e.target.value }))}
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <Card key={course.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start gap-2">
                      <CardTitle className="text-lg line-clamp-2">{course.title}</CardTitle>
                      <Badge variant="outline" className="shrink-0">{course.level}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{course.category}</p>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-primary" />
                        <span>{course.enrolledCount || 0}/{course.capacity || '∞'} enrolled</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-primary" />
                        <span>{course.totalClasses} classes</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-primary" />
                        <span>{course.duration}</span>
                      </div>
                      <div className="pt-2 border-t">
                        <p className="font-semibold">₹{course.price}</p>
                        {course.originalPrice && <p className="text-xs text-muted-foreground line-through">₹{course.originalPrice}</p>}
                      </div>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Button size="sm" variant="outline" className="flex-1" onClick={() => setSelectedCourse(course)}>
                        <Edit2 className="w-3 h-3 mr-1" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        className="flex-1"
                        onClick={() => handleDeleteCourse(course.id)}
                        disabled={loading}
                      >
                        <Trash2 className="w-3 h-3 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Bulk Operations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Link className="w-5 h-5" />
                  Bulk Update Zoho Webinar Links
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {courses.map((course) => (
                  <div key={course.id} className="flex items-center gap-4">
                    <Label className="w-48 text-xs font-semibold truncate">{course.title}</Label>
                    <Input
                      placeholder="https://meeting.zoho.com/..."
                      value={bulkZoomLinks[course.id] || ""}
                      onChange={(e) => setBulkZoomLinks(prev => ({
                        ...prev,
                        [course.id]: e.target.value
                      }))}
                      className="flex-1 text-xs h-8"
                    />
                  </div>
                ))}
                <Button
                  onClick={handleBulkUpdateZoom}
                  disabled={loading || Object.keys(bulkZoomLinks).length === 0}
                  className="w-full"
                >
                  {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Update All Zoho Webinar Links
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Syllabus Tab */}
          <TabsContent value="syllabus" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Manage Syllabus</CardTitle>
                <p className="text-sm text-muted-foreground mt-2">Edit course topics, descriptions, and learning outcomes</p>
              </CardHeader>
              <CardContent className="space-y-4">
                {courses.length > 0 && (
                  <div className="mb-4">
                    <Label className="text-sm font-semibold mb-2 block">Select Course</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                      {courses.map((course) => (
                        <Button
                          key={course.id}
                          variant={selectedCourse?.id === course.id ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSelectedCourse(course)}
                          className="text-xs"
                        >
                          {course.title.substring(0, 15)}...
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
                
                {selectedCourse ? (
                  <div className="space-y-4">
                    <p className="font-semibold">Editing: {selectedCourse.title}</p>
                    {selectedCourse.syllabus?.map((item, idx) => (
                      <div key={idx} className="p-4 border rounded-lg space-y-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-semibold">Week {item.week}: {item.topic}</p>
                            <p className="text-sm text-muted-foreground">{item.description}</p>
                          </div>
                          <Button size="sm" variant="outline" onClick={() => handleEditSyllabus(item)}>
                            <Edit2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">Select a course above to edit syllabus</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Schedules Tab */}
          <TabsContent value="schedules" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Manage Class Schedules</CardTitle>
                <p className="text-sm text-muted-foreground mt-2">Edit dates, times, and Zoho Webinar links for individual classes</p>
              </CardHeader>
              <CardContent className="space-y-4">
                {courses.length > 0 && (
                  <div className="mb-4">
                    <Label className="text-sm font-semibold mb-2 block">Select Course</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                      {courses.map((course) => (
                        <Button
                          key={course.id}
                          variant={selectedCourse?.id === course.id ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSelectedCourse(course)}
                          className="text-xs"
                        >
                          {course.title.substring(0, 15)}...
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {selectedCourse ? (
                  <div className="space-y-4">
                    <p className="font-semibold">Editing: {selectedCourse.title}</p>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b">
                            <th className="px-4 py-2 text-left">Topic</th>
                            <th className="px-4 py-2 text-left">Date</th>
                            <th className="px-4 py-2 text-left">Time</th>
                            <th className="px-4 py-2 text-left">Zoho Webinar Link</th>
                            <th className="px-4 py-2 text-left">Recording</th>
                            <th className="px-4 py-2 text-left">Status</th>
                            <th className="px-4 py-2 text-center">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedCourse.schedule?.map((item) => (
                            <tr key={item.id} className="border-b hover:bg-muted/50">
                              <td className="px-4 py-2">{item.topic}</td>
                              <td className="px-4 py-2">{item.date}</td>
                              <td className="px-4 py-2">{item.time}</td>
                              <td className="px-4 py-2 text-xs truncate">{item.meetLink}</td>
                              <td className="px-4 py-2 text-xs truncate">{item.recordingUrl || "-"}</td>
                              <td className="px-4 py-2"><Badge variant="outline" className="text-xs">{item.status}</Badge></td>
                              <td className="px-4 py-2 text-center">
                                <div className="flex items-center justify-center gap-1">
                                  <Button size="sm" variant="ghost" onClick={() => handleEditSchedule(item)}>
                                    <Edit2 className="w-3 h-3" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => handleDeleteScheduleSession(item.id)}
                                    disabled={loading}
                                  >
                                    <Trash2 className="w-3 h-3 text-destructive" />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <Card className="bg-muted/20">
                      <CardHeader>
                        <CardTitle className="text-base">Add Class Session</CardTitle>
                      </CardHeader>
                      <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        <Input
                          placeholder="Class topic"
                          value={newScheduleItem.topic}
                          onChange={(e) => setNewScheduleItem((prev) => ({ ...prev, topic: e.target.value }))}
                        />
                        <Input
                          type="date"
                          value={newScheduleItem.date}
                          onChange={(e) => setNewScheduleItem((prev) => ({ ...prev, date: e.target.value }))}
                        />
                        <Input
                          type="time"
                          value={newScheduleItem.time}
                          onChange={(e) => setNewScheduleItem((prev) => ({ ...prev, time: e.target.value }))}
                        />
                        <Input
                          placeholder="Zoho Webinar link"
                          value={newScheduleItem.meetLink || ""}
                          onChange={(e) => setNewScheduleItem((prev) => ({ ...prev, meetLink: e.target.value }))}
                        />
                        <Input
                          placeholder="Recording URL (optional)"
                          value={newScheduleItem.recordingUrl || ""}
                          onChange={(e) => setNewScheduleItem((prev) => ({ ...prev, recordingUrl: e.target.value }))}
                        />
                        <select
                          value={newScheduleItem.status}
                          onChange={(e) =>
                            setNewScheduleItem((prev) => ({
                              ...prev,
                              status: e.target.value as ScheduleItem["status"],
                            }))
                          }
                          className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                        >
                          <option value="upcoming">upcoming</option>
                          <option value="live">live</option>
                          <option value="completed">completed</option>
                        </select>
                        <Button className="md:col-span-2 lg:col-span-3 gap-2" onClick={handleAddScheduleSession} disabled={loading}>
                          <Plus className="w-4 h-4" />
                          Add Class Session
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">Select a course above to edit schedules</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Content Tab */}
          <TabsContent value="content" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Manage Recordings, Notes & Announcements</CardTitle>
                <p className="text-sm text-muted-foreground mt-2">Create, edit, and remove course content from one place</p>
              </CardHeader>
              <CardContent className="space-y-6">
                {courses.length > 0 && (
                  <div>
                    <Label className="text-sm font-semibold mb-2 block">Select Course</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                      {courses.map((course) => (
                        <Button
                          key={course.id}
                          variant={selectedCourse?.id === course.id ? "default" : "outline"}
                          size="sm"
                          onClick={() => {
                            setSelectedCourse(course);
                            resetNoteForm();
                            resetAnnouncementForm();
                          }}
                          className="text-xs"
                        >
                          {course.title.substring(0, 15)}...
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {!selectedCourse ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Select a course above to manage content.</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <p className="font-semibold">Editing content for: {selectedCourse.title}</p>

                    <Card className="bg-muted/20">
                      <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                          <Video className="w-4 h-4" />
                          Recordings
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        {(selectedCourse.schedule || []).length === 0 ? (
                          <p className="text-sm text-muted-foreground">No class sessions available.</p>
                        ) : (
                          selectedCourse.schedule.map((session) => (
                            <div key={session.id} className="rounded-md border p-3 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-2">
                              <div>
                                <p className="font-medium text-sm">{session.topic}</p>
                                <p className="text-xs text-muted-foreground">{session.date} • {session.time} • {session.status}</p>
                              </div>
                              <div className="text-xs">
                                {session.recordingUrl ? (
                                  <a href={session.recordingUrl} target="_blank" rel="noreferrer" className="text-primary underline">
                                    Open recording
                                  </a>
                                ) : (
                                  <span className="text-muted-foreground">No recording URL yet (add/edit in Schedules tab)</span>
                                )}
                              </div>
                            </div>
                          ))
                        )}
                      </CardContent>
                    </Card>

                    <Card className="bg-muted/20">
                      <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                          <FileText className="w-4 h-4" />
                          Notes
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <Input
                            placeholder="Note title"
                            value={newNote.title}
                            onChange={(e) => setNewNote((prev) => ({ ...prev, title: e.target.value }))}
                          />
                          <Input
                            placeholder="File URL"
                            value={newNote.fileUrl}
                            onChange={(e) => setNewNote((prev) => ({ ...prev, fileUrl: e.target.value }))}
                          />
                          <Input
                            placeholder="Description"
                            value={newNote.description}
                            onChange={(e) => setNewNote((prev) => ({ ...prev, description: e.target.value }))}
                          />
                          <select
                            value={newNote.type}
                            onChange={(e) => setNewNote((prev) => ({ ...prev, type: e.target.value as Note["type"] }))}
                            className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                          >
                            <option value="pdf">pdf</option>
                            <option value="doc">doc</option>
                            <option value="ppt">ppt</option>
                          </select>
                        </div>
                        <div className="flex gap-2">
                          <Button onClick={handleSaveNote} disabled={loading} className="gap-2">
                            <Save className="w-4 h-4" />
                            {editingNoteId ? "Update Note" : "Add Note"}
                          </Button>
                          {editingNoteId && (
                            <Button variant="outline" onClick={resetNoteForm}>Cancel Edit</Button>
                          )}
                        </div>

                        <div className="space-y-2">
                          {(selectedCourse.notes || []).length === 0 ? (
                            <p className="text-sm text-muted-foreground">No notes added yet.</p>
                          ) : (
                            selectedCourse.notes.map((note) => (
                              <div key={note.id} className="rounded-md border p-3 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                                <div>
                                  <p className="font-medium text-sm">{note.title}</p>
                                  <p className="text-xs text-muted-foreground">{note.description || "No description"}</p>
                                  <p className="text-xs text-muted-foreground">Type: {note.type}</p>
                                </div>
                                <div className="flex gap-2">
                                  <Button size="sm" variant="outline" onClick={() => handleEditNote(note)}>
                                    <Edit2 className="w-3 h-3 mr-1" />
                                    Edit
                                  </Button>
                                  <Button size="sm" variant="destructive" onClick={() => handleDeleteNote(note.id)} disabled={loading}>
                                    <Trash2 className="w-3 h-3 mr-1" />
                                    Delete
                                  </Button>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-muted/20">
                      <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                          <Megaphone className="w-4 h-4" />
                          Announcements
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <Input
                            placeholder="Announcement title"
                            value={newAnnouncement.title}
                            onChange={(e) => setNewAnnouncement((prev) => ({ ...prev, title: e.target.value }))}
                          />
                          <Input
                            type="date"
                            value={newAnnouncement.date}
                            onChange={(e) => setNewAnnouncement((prev) => ({ ...prev, date: e.target.value }))}
                          />
                          <Textarea
                            placeholder="Announcement message"
                            value={newAnnouncement.message}
                            onChange={(e) => setNewAnnouncement((prev) => ({ ...prev, message: e.target.value }))}
                            className="md:col-span-2"
                            rows={2}
                          />
                          <select
                            value={newAnnouncement.priority}
                            onChange={(e) =>
                              setNewAnnouncement((prev) => ({
                                ...prev,
                                priority: e.target.value as Announcement["priority"],
                              }))
                            }
                            className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                          >
                            <option value="normal">normal</option>
                            <option value="urgent">urgent</option>
                          </select>
                        </div>
                        <div className="flex gap-2">
                          <Button onClick={handleSaveAnnouncement} disabled={loading} className="gap-2">
                            <Save className="w-4 h-4" />
                            {editingAnnouncementId ? "Update Announcement" : "Add Announcement"}
                          </Button>
                          {editingAnnouncementId && (
                            <Button variant="outline" onClick={resetAnnouncementForm}>Cancel Edit</Button>
                          )}
                        </div>

                        <div className="space-y-2">
                          {(selectedCourse.announcements || []).length === 0 ? (
                            <p className="text-sm text-muted-foreground">No announcements added yet.</p>
                          ) : (
                            selectedCourse.announcements.map((announcement) => (
                              <div key={announcement.id} className="rounded-md border p-3 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                                <div>
                                  <div className="flex items-center gap-2">
                                    <p className="font-medium text-sm">{announcement.title}</p>
                                    <Badge variant={announcement.priority === "urgent" ? "destructive" : "secondary"}>
                                      {announcement.priority}
                                    </Badge>
                                  </div>
                                  <p className="text-xs text-muted-foreground mt-1">{announcement.message}</p>
                                  <p className="text-xs text-muted-foreground">{announcement.date}</p>
                                </div>
                                <div className="flex gap-2">
                                  <Button size="sm" variant="outline" onClick={() => handleEditAnnouncement(announcement)}>
                                    <Edit2 className="w-3 h-3 mr-1" />
                                    Edit
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => handleDeleteAnnouncement(announcement.id)}
                                    disabled={loading}
                                  >
                                    <Trash2 className="w-3 h-3 mr-1" />
                                    Delete
                                  </Button>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Quizzes Tab */}
          <TabsContent value="quizzes" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Manage Quizzes & Exams</CardTitle>
                <p className="text-sm text-muted-foreground mt-2">Create and edit course quizzes, final exams, and questions</p>
              </CardHeader>
              <CardContent className="space-y-4">
                {courses.length > 0 && (
                  <div className="mb-4">
                    <Label className="text-sm font-semibold mb-2 block">Select Course</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                      {courses.map((course) => (
                        <Button
                          key={course.id}
                          variant={selectedCourse?.id === course.id ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSelectedCourse(course)}
                          className="text-xs"
                        >
                          {course.title.substring(0, 15)}...
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {selectedCourse ? (
                  <div className="space-y-4">
                    <p className="font-semibold">Quizzes For: {selectedCourse.title}</p>
                    <Card className="bg-muted/30">
                      <CardHeader>
                        <CardTitle className="text-base">Final Exam</CardTitle>
                        <p className="text-xs text-muted-foreground mt-1">{selectedCourse.finalQuiz?.questions?.length || 0} questions</p>
                      </CardHeader>
                      <CardContent className="flex gap-2">
                        <Button size="sm" variant="outline" className="flex-1" onClick={() => setEditingQuestion(null)}>
                          <Edit2 className="w-3 h-3 mr-1" />
                          Edit Questions
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1">
                          View Results
                        </Button>
                      </CardContent>
                    </Card>
                    <Button className="w-full gap-2">
                      <Plus className="w-4 h-4" />
                      Create New Quiz
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">Select a course above to manage quizzes</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <p className="text-sm text-muted-foreground mt-2">Manage student accounts, roles, and permissions</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <Card className="bg-muted/20">
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <UserPlus className="w-4 h-4" />
                      Create User Profile (users collection)
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <Input
                      placeholder="UID"
                      value={newUser.uid}
                      onChange={(e) => setNewUser((prev) => ({ ...prev, uid: e.target.value }))}
                    />
                    <Input
                      placeholder="Name"
                      value={newUser.name}
                      onChange={(e) => setNewUser((prev) => ({ ...prev, name: e.target.value }))}
                    />
                    <Input
                      placeholder="Email"
                      value={newUser.email}
                      onChange={(e) => setNewUser((prev) => ({ ...prev, email: e.target.value }))}
                    />
                    <Button onClick={handleCreateUser} disabled={loading} className="gradient-bg">
                      Create User
                    </Button>
                  </CardContent>
                </Card>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold">All Users ({users.length})</p>
                    <Button variant="outline" size="sm" onClick={loadUsers} disabled={loading}>
                      Reload Users
                    </Button>
                  </div>

                  {usersLoading ? (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Syncing users from Firebase...
                    </div>
                  ) : usersError ? (
                    <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
                      {usersError}
                    </div>
                  ) : null}

                  {!usersLoading && !usersError && users.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No users found or permission denied to read users collection.</p>
                  ) : (
                    users.map((u) => {
                      const selectedCourseId = userCourseSelection[u.uid] || "";
                      const selectedCourseObj = courses.find((c) => c.id === selectedCourseId);
                      const currentProgress = selectedCourseId ? u.progress?.[selectedCourseId] : undefined;

                      return (
                        <Card key={u.uid} className="border-muted">
                          <CardContent className="pt-6 space-y-4">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                              <div>
                                <p className="font-semibold">{u.name || "Student"}</p>
                                <p className="text-xs text-muted-foreground">{u.email} • {u.uid}</p>
                              </div>
                              <div className="flex gap-2 text-xs">
                                <Badge variant="outline">{u.role || "student"}</Badge>
                                <Badge variant="secondary">Paid: {u.paidCourses?.length || 0}</Badge>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-5 gap-3">
                              <select
                                value={selectedCourseId}
                                onChange={(e) => setUserCourseSelection((prev) => ({ ...prev, [u.uid]: e.target.value }))}
                                className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                              >
                                <option value="">Select course</option>
                                {courses.map((c) => (
                                  <option key={c.id} value={c.id}>
                                    {c.title}
                                  </option>
                                ))}
                              </select>

                              <Input
                                type="number"
                                min={0}
                                max={100}
                                placeholder="Manual %"
                                value={manualProgressByUser[u.uid] ?? ""}
                                onChange={(e) =>
                                  setManualProgressByUser((prev) => ({
                                    ...prev,
                                    [u.uid]: Number(e.target.value),
                                  }))
                                }
                              />

                              <Button
                                variant="outline"
                                onClick={() => handleAssignCourseOnly(u)}
                                disabled={loading || !selectedCourseId}
                              >
                                Assign Course
                              </Button>

                              <Button
                                variant="outline"
                                onClick={() => handleUpdateCourseProgress(u, false)}
                                disabled={loading || !selectedCourseId}
                              >
                                Save Progress
                              </Button>

                              <Button
                                className="gradient-bg"
                                onClick={() => handleUpdateCourseProgress(u, true)}
                                disabled={loading || !selectedCourseId}
                              >
                                <CheckCircle2 className="w-4 h-4 mr-2" />
                                Force 100%
                              </Button>
                            </div>

                            {selectedCourseObj && (
                              <p className="text-xs text-muted-foreground">
                                Current in {selectedCourseObj.title}: {currentProgress?.completedClasses || 0}/{selectedCourseObj.totalClasses} classes, quiz {currentProgress?.quizScore || 0}%, completed {currentProgress?.completed ? "yes" : "no"}
                              </p>
                            )}
                          </CardContent>
                        </Card>
                      );
                    })
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Edit Dialog */}
        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Details</DialogTitle>
            </DialogHeader>
            
            {editingSchedule && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="topic" className="text-sm">Topic</Label>
                  <Input
                    id="topic"
                    value={editingSchedule.topic}
                    onChange={(e) => setEditingSchedule({ ...editingSchedule, topic: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="date" className="text-sm">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={editingSchedule.date}
                    onChange={(e) => setEditingSchedule({ ...editingSchedule, date: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="time" className="text-sm">Time</Label>
                  <Input
                    id="time"
                    type="time"
                    value={editingSchedule.time}
                    onChange={(e) => setEditingSchedule({ ...editingSchedule, time: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="zoom" className="text-sm">Zoho Webinar Link</Label>
                  <Input
                    id="zoom"
                    placeholder="https://meeting.zoho.com/..."
                    value={editingSchedule.meetLink}
                    onChange={(e) => setEditingSchedule({ ...editingSchedule, meetLink: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="recording" className="text-sm">Recording URL</Label>
                  <Input
                    id="recording"
                    placeholder="https://..."
                    value={editingSchedule.recordingUrl || ""}
                    onChange={(e) => setEditingSchedule({ ...editingSchedule, recordingUrl: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="status" className="text-sm">Status</Label>
                  <select
                    id="status"
                    value={editingSchedule.status}
                    onChange={(e) => setEditingSchedule({ ...editingSchedule, status: e.target.value })}
                    className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm mt-1"
                  >
                    <option value="upcoming">upcoming</option>
                    <option value="live">live</option>
                    <option value="completed">completed</option>
                  </select>
                </div>
                <div className="flex gap-2 pt-4">
                  <Button variant="outline" className="flex-1" onClick={() => setShowEditDialog(false)}>Cancel</Button>
                  <Button className="flex-1 gradient-bg" onClick={handleSaveSchedule}>Save Changes</Button>
                </div>
              </div>
            )}

            {editingSyllabus && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="week" className="text-sm">Week</Label>
                  <Input
                    id="week"
                    type="number"
                    value={editingSyllabus.week}
                    onChange={(e) => setEditingSyllabus({ ...editingSyllabus, week: parseInt(e.target.value) })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="syllTopic" className="text-sm">Topic</Label>
                  <Input
                    id="syllTopic"
                    value={editingSyllabus.topic}
                    onChange={(e) => setEditingSyllabus({ ...editingSyllabus, topic: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="description" className="text-sm">Description</Label>
                  <Textarea
                    id="description"
                    value={editingSyllabus.description}
                    onChange={(e) => setEditingSyllabus({ ...editingSyllabus, description: e.target.value })}
                    className="mt-1"
                    rows={3}
                  />
                </div>
                <div className="flex gap-2 pt-4">
                  <Button variant="outline" className="flex-1" onClick={() => setShowEditDialog(false)}>Cancel</Button>
                  <Button className="flex-1 gradient-bg" onClick={handleSaveSyllabus}>Save Changes</Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Course Editor Modal */}
        {selectedCourse && activeTab === "courses" && (
          <CourseEditor
            course={selectedCourse}
            onClose={() => setSelectedCourse(null)}
            onSave={loadCourses}
          />
        )}
      </div>
    </div>
  );
};

export default Admin;