import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useCourse } from "@/hooks/useCourse";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, Video, FileText, Megaphone, BrainCircuit, Award, Radio, Clock, CheckCircle2, ExternalLink, Download, X } from "lucide-react";
import QuizView from "@/components/QuizView";
import { LoadingScreen } from "@/components/LoadingScreen";
import { useState, useEffect } from "react";
import type { Quiz, Course, ScheduleItem, CourseProgress } from "@/types/firebase";
import { useAuth } from "@/lib/auth-context";
import { getLessonQuestions } from "@/lib/lessonQuizzes";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { useQueryClient } from "@tanstack/react-query";
import { coursesRef, usersRef } from "@/firebase/firestore";
import { updateDoc } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";

const CertificateModal = ({ course, userProgress, userName, userId, onClose }: { course: Course; userProgress: CourseProgress; userName: string; userId: string; onClose: () => void }) => {
  const certificateId = `NVLN-${course.id.substring(0,4).toUpperCase()}-${userId.substring(0,6).toUpperCase()}`;
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadPDF = async () => {
    const element = document.getElementById("certificate-container");
    if (!element) return;
    
    setIsDownloading(true);
    // Wait a tick for React to flush the state to the DOM (removes gradients)
    await new Promise(resolve => setTimeout(resolve, 50));
    try {
      // Create high-res canvas
      const canvas = await html2canvas(element, {
        scale: 3,
        useCORS: true,
        backgroundColor: null, // Transparent to keep theme
      });
      
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("landscape", "mm", "a4");
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = (pdfHeight - imgHeight * ratio) / 2;
      
      // Fill black background for the PDF to match dark mode theme natively
      pdf.setFillColor(10, 15, 25); // #0a0f19 roughly
      pdf.rect(0, 0, pdfWidth, pdfHeight, "F");
      
      pdf.addImage(imgData, "PNG", imgX, imgY, imgWidth * ratio, imgHeight * ratio);
      pdf.save(`${course.title.replace(/\s+/g, "_")}_Certificate.pdf`);
    } catch (error) {
      console.error("Failed to generate PDF", error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100] p-4 sm:p-6 backdrop-blur-sm overflow-y-auto">
      <motion.div 
        initial={{ scale: 0.9, y: 20 }} 
        animate={{ scale: 1, y: 0 }} 
        className="relative bg-background text-foreground rounded-xl w-full max-w-2xl shadow-2xl overflow-hidden"
        id="certificate-container"
      >
        {/* Fancy Inner Border */}
        <div className="p-4 sm:p-8 border-[6px] border-double border-primary/20 m-2 sm:m-4 rounded-lg relative overflow-hidden bg-white/5 dark:bg-black/5">
          {/* Decorative Corner Elements */}
          <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-primary/40 rounded-tl max-sm:hidden"></div>
          <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-primary/40 rounded-tr max-sm:hidden"></div>
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-primary/40 rounded-bl max-sm:hidden"></div>
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-primary/40 rounded-br max-sm:hidden"></div>
          
          {/* Watermark Logo */}
          <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
            <Award className="w-96 h-96" />
          </div>

          <div className="relative z-10 text-center space-y-4 py-1">
            <div className="flex justify-center mb-3">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent shadow-lg shadow-primary/20 ring-2 ring-background">
                <Award className="w-8 h-8 text-primary-foreground" />
              </div>
            </div>
            
            <div className="space-y-1">
              <h2 className={`text-2xl sm:text-3xl font-black tracking-tight uppercase font-display ${isDownloading ? 'text-primary' : 'text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-primary'}`} style={{ letterSpacing: '0.1em' }}>
                Certificate
              </h2>
              <p className="text-base tracking-[0.2em] text-muted-foreground uppercase font-semibold">Of Completion</p>
            </div>
            
            <div className="pt-3">
              <p className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-widest mb-2">This is to proudly certify that</p>
              <h3 className="text-2xl sm:text-3xl font-bold text-foreground font-serif italic pb-1 border-b-2 border-primary/20 inline-block px-6">
                {userName || "Student Name"}
              </h3>
            </div>
            
            <div className="space-y-2 pt-2 max-w-lg mx-auto">
              <p className="text-[10px] sm:text-xs text-muted-foreground leading-relaxed">
                has successfully completed the comprehensive curriculum and demonstrated absolute proficiency in the course:
              </p>
              <h4 className={`text-lg sm:text-xl font-bold ${isDownloading ? 'text-foreground' : 'bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent'}`}>
                {course.title || "Course Name"}
              </h4>
            </div>
            
            <div className="grid grid-cols-2 gap-4 pt-6 pb-2 sm:px-6 border-t border-border/50 mt-6 mb-2">
              <div className="flex flex-col items-center justify-end">
                <p className="text-sm font-bold text-foreground font-serif mb-1">{course.instructor || "Instructor"}</p>
                <div className="h-px w-20 bg-primary/30 mb-1"></div>
                <p className="text-[9px] text-muted-foreground uppercase tracking-wider">Course Instructor</p>
              </div>
              
              <div className="flex flex-col items-center justify-end">
                <div className="w-10 h-10 rounded-full border border-primary/20 flex items-center justify-center mb-1 shadow-inner bg-background">
                  <div className="w-6 h-6 rounded-full border border-dashed border-primary/40 flex items-center justify-center">
                    <CheckCircle2 className="w-3 h-3 text-primary/60" />
                  </div>
                </div>
                <p className="text-sm font-bold text-foreground font-serif mb-1">
                  {userProgress.certificateDate ? new Date(userProgress.certificateDate).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) : new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
                <div className="h-px w-20 bg-primary/30 mb-1"></div>
                <p className="text-[9px] text-muted-foreground uppercase tracking-wider">Date of Issue</p>
              </div>
            </div>
          </div>
        </div>

        {/* Certificate ID */}
        <div className="absolute bottom-2 right-4 sm:bottom-4 sm:right-6 text-[10px] text-muted-foreground/60 font-mono tracking-widest z-20">
          ID: {certificateId}
        </div>

        {/* Action Buttons - Hidden during canvas capture mostly via z-index or out of bounds, but we can explicitly hide */}
        <div className="absolute top-4 right-4 flex gap-2 z-20" data-html2canvas-ignore>
          <Button variant="outline" size="icon" className="rounded-full bg-background/50 backdrop-blur-md border-border/50 hover:bg-background" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </motion.div>
      
      {/* Floating Action Bar */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 p-2 bg-background/80 backdrop-blur-xl border rounded-full shadow-2xl z-[110]" data-html2canvas-ignore>
        <Button variant="ghost" className="rounded-full" onClick={onClose} disabled={isDownloading}>
          Cancel
        </Button>
        <Button className="rounded-full gradient-bg text-primary-foreground" onClick={handleDownloadPDF} disabled={isDownloading}>
          {isDownloading ? (
            <>
              <div className="w-4 h-4 mr-2 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
              Generating PDF...
            </>
          ) : (
            <>
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </>
          )}
        </Button>
      </div>
    </motion.div>
  );
};

const CourseDetail = () => {
  const { courseId } = useParams() as { courseId: string };
  const navigate = useNavigate();
  const { data: course, isLoading } = useCourse({ courseId });
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [activeLessonQuiz, setActiveLessonQuiz] = useState<{ lessonId: string, quiz: Quiz } | null>(null);
  const [showCertificate, setShowCertificate] = useState(false);
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Access control: check if user has paid for the course
  useEffect(() => {
    if (!user || !course) return;

    // If user hasn't paid for this course, redirect
    if (!user.paidCourses?.includes(courseId)) {
      toast({
        title: "Access Denied",
        description: "Please purchase this course first to access it.",
        variant: "destructive",
      });
      navigate("/courses");
      return;
    }

    // Auto-enroll user if not already enrolled
    if (!user.enrolledCourses.includes(courseId)) {
      // User can view since they paid, enrollment will be auto-managed
    }
  }, [user, course, courseId, navigate, toast]);

  const updateCourseProgress = async (completedClasses: number, quizScore?: number) => {
    if (!course || !user) {
      console.warn("❌ Cannot update progress: missing course or user", { course: !!course, user: !!user });
      toast({
        title: "Error",
        description: "Missing course or user data",
        variant: "destructive",
      });
      return;
    }

    try {
      console.log(`🔄 Starting progress update for course: ${course.id}`, {
        completedClasses,
        quizScore,
        userId: user.uid,
      });

      // Get current progress, with defensive defaults
      const defaultProgress: CourseProgress = {
        completedClasses: 0,
        totalClasses: course.totalClasses,
        quizScore: 0,
        completed: false,
        isPaid: true,
        completedLessons: [],
      };

      // Merge with existing progress to handle partially initialized objects
      let courseProgress = user.progress?.[course.id];
      if (!courseProgress) {
        courseProgress = defaultProgress;
      } else {
        // Ensure all fields exist and are not undefined
        courseProgress = {
          completedClasses: courseProgress.completedClasses ?? 0,
          totalClasses: courseProgress.totalClasses ?? course.totalClasses,
          quizScore: courseProgress.quizScore ?? 0,
          completed: courseProgress.completed ?? false,
          certificateDate: courseProgress.certificateDate,
          isPaid: courseProgress.isPaid ?? true,
          completedLessons: courseProgress.completedLessons ?? [],
        };
      }

      console.log("📊 Current progress in user object:", courseProgress);

      const newQuizScore = quizScore !== undefined ? Math.max(courseProgress.quizScore, quizScore) : courseProgress.quizScore;
      const shouldBeCompleted = completedClasses === course.totalClasses && newQuizScore >= 60;
      const updatedProgress: CourseProgress = {
        completedClasses: Math.max(0, completedClasses || 0), // Ensure non-negative number
        totalClasses: Math.max(1, courseProgress.totalClasses || course.totalClasses), // Ensure at least 1
        quizScore: Math.max(0, newQuizScore || 0), // Ensure non-negative
        completed: shouldBeCompleted === true, // Ensure boolean
        certificateDate: shouldBeCompleted && !courseProgress.certificateDate ? new Date().toISOString() : courseProgress.certificateDate,
        isPaid: true,
        completedLessons: courseProgress.completedLessons ?? [],
      };

      console.log("✏️ Updated progress object to save:", updatedProgress);

      // Validate before saving - no undefined fields allowed
      if (Object.values(updatedProgress).includes(undefined as any)) {
        throw new Error("Progress object has undefined fields");
      }

      const updatePayload = {
        [`progress.${course.id}`]: updatedProgress,
      };

      // Execute the update
      await updateDoc(usersRef(user.uid), updatePayload);
      console.log("✅ Successfully saved to Firestore!");

      // Show success toast
      toast({
        title: "Success",
        description: quizScore !== undefined ? "Quiz score saved successfully!" : "Progress updated successfully!",
      });

      // Invalidate cache
      console.log("🔄 Invalidating React Query cache...");
      queryClient.invalidateQueries({ queryKey: ["course", course.id] });
      queryClient.invalidateQueries({ queryKey: ["userCourses", user.uid] });
      console.log("✅ Cache invalidated!");
    } catch (error) {
      console.error("❌ FAILED to update course progress:", error);
      console.error("Error details:", {
        message: error instanceof Error ? error.message : "Unknown error",
        code: (error as any)?.code || "N/A",
        stack: (error as any)?.stack,
      });

      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      toast({
        title: "Error Saving Progress",
        description: `Failed to save: ${errorMessage}. Check console for details.`,
        variant: "destructive",
      });
    }
  };

  const generateLessonQuiz = (item: ScheduleItem): Quiz => {
    const questionsData = getLessonQuestions(item.topic);
    return {
      id: `quiz-${item.id}`,
      title: `${item.topic} - Knowledge Check`,
      topic: item.topic,
      questions: questionsData.map((qData, index) => ({
        id: `q-${item.id}-${index}`,
        ...qData
      }))
    };
  };

  const startLessonQuiz = (item: ScheduleItem) => {
    setActiveLessonQuiz({ lessonId: item.id, quiz: item.quiz || generateLessonQuiz(item) });
  };

  const handleLessonQuizResult = async (score: number) => {
    if (!activeLessonQuiz || !course || !user) return;

    // We treat score >= 60 as passing
    if (score >= 60) {
      let currentProgress = user.progress?.[course.id] || {
        completedClasses: 0,
        totalClasses: course.totalClasses,
        quizScore: 0,
        completed: false,
        isPaid: true,
        completedLessons: [],
      };

      const currentCompletedLessons = currentProgress.completedLessons || [];
      if (!currentCompletedLessons.includes(activeLessonQuiz.lessonId)) {
        const updatedCompletedLessons = [...currentCompletedLessons, activeLessonQuiz.lessonId];
        const newCompletedClasses = Math.min(updatedCompletedLessons.length, course.totalClasses);

        const shouldBeCompleted = newCompletedClasses === course.totalClasses && currentProgress.quizScore >= 60;

        const updatedProgress: CourseProgress = {
          ...currentProgress,
          completedClasses: newCompletedClasses,
          completed: shouldBeCompleted === true,
          certificateDate: shouldBeCompleted && !currentProgress.certificateDate ? new Date().toISOString() : currentProgress.certificateDate,
          completedLessons: updatedCompletedLessons,
        };

        try {
          await updateDoc(usersRef(user.uid), {
            [`progress.${course.id}`]: updatedProgress,
          });
          queryClient.invalidateQueries({ queryKey: ["course", course.id] });
          queryClient.invalidateQueries({ queryKey: ["userCourses", user.uid] });
          toast({
            title: "Success",
            description: "Lesson marked as completed!",
          });
        } catch (error) {
          toast({
            title: "Error",
            description: "Failed to mark lesson.",
            variant: "destructive",
          });
        }
      }
    } else {
      toast({
        title: "Keep Trying",
        description: "You need to answer correctly to complete the lesson.",
        variant: "destructive",
      });
    }
    setActiveLessonQuiz(null);
  };

  const handleQuizResult = async (score: number) => {
    console.log("🎯 Quiz completed! Received score:", score, "Type:", typeof score);

    if (!course || !user) {
      console.error("❌ Cannot save quiz: missing course or user");
      toast({
        title: "Error",
        description: "Cannot save quiz result",
        variant: "destructive",
      });
      return;
    }

    // Defensive progress initialization
    const defaultProgress: CourseProgress = {
      completedClasses: 0,
      totalClasses: course.totalClasses,
      quizScore: 0,
      completed: false,
      isPaid: true,
      completedLessons: [],
    };

    let courseProgress = user.progress?.[course.id];
    if (!courseProgress) {
      courseProgress = defaultProgress;
    } else {
      courseProgress = {
        completedClasses: courseProgress.completedClasses ?? 0,
        totalClasses: courseProgress.totalClasses ?? course.totalClasses,
        quizScore: courseProgress.quizScore ?? 0,
        completed: courseProgress.completed ?? false,
        certificateDate: courseProgress.certificateDate,
        isPaid: courseProgress.isPaid ?? true,
      };
    }

    console.log("📝 Saving quiz result with:", {
      score,
      currentCompletedClasses: courseProgress.completedClasses,
      courseId: course.id,
    });

    await updateCourseProgress(courseProgress.completedClasses, score);
    setActiveQuiz(null);
    console.log("✅ Quiz handler complete, modal closed");
  };

  if (isLoading) return <LoadingScreen message="Loading course..." fullScreen={false} />;
  if (!course) return <div className="p-8 text-center text-muted-foreground">Course not found</div>;
  if (!user) return <LoadingScreen message="Loading your profile..." fullScreen={false} />;

  // Defensive progress initialization for display
  const defaultProgress: CourseProgress = {
    completedClasses: 0,
    totalClasses: course.totalClasses,
    quizScore: 0,
    completed: false,
    isPaid: true,
  };

  let courseProgress = user.progress?.[course.id];
  if (!courseProgress) {
    courseProgress = defaultProgress;
  } else {
    courseProgress = {
      completedClasses: courseProgress.completedClasses ?? 0,
      totalClasses: courseProgress.totalClasses ?? course.totalClasses,
      quizScore: courseProgress.quizScore ?? 0,
      completed: courseProgress.completed ?? false,
      certificateDate: courseProgress.certificateDate,
      isPaid: courseProgress.isPaid ?? true,
      completedLessons: courseProgress.completedLessons ?? [],
    };
  }

  const progressPercentage = Math.round((courseProgress.completedClasses / course.totalClasses) * 100);
  const isCompleted = courseProgress.completed;

  const isClassCompleted = (dateStr: string, timeStr: string) => {
    try {
      const [time, period] = timeStr.split(" ");
      if (!time || !period) return true; // if format changes blindly allow
      let [hoursStr, minutesStr] = time.split(":");
      let hours = parseInt(hoursStr, 10);
      let minutes = parseInt(minutesStr, 10);

      if (period.toUpperCase() === "PM" && hours !== 12) hours += 12;
      if (period.toUpperCase() === "AM" && hours === 12) hours = 0;

      const classDate = new Date(`${dateStr}T${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00`);
      return classDate < new Date();
    } catch (e) {
      return true; // Fallback to allowing standard quiz if error occurs
    }
  };

  const statusColors: Record<string, string> = {
    live: "bg-destructive/10 text-destructive border-destructive/20",
    upcoming: "bg-primary/10 text-primary border-primary/20",
    completed: "bg-muted text-muted-foreground border-border",
  };

  if (activeLessonQuiz) {
    return <QuizView quiz={activeLessonQuiz.quiz} onClose={() => setActiveLessonQuiz(null)} onComplete={handleLessonQuizResult} />;
  }

  if (activeQuiz) {
    return <QuizView quiz={activeQuiz} onClose={() => setActiveQuiz(null)} onComplete={handleQuizResult} />;
  }

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
      {showCertificate && isCompleted && (
        <CertificateModal course={course} userProgress={courseProgress} userName={user.name} userId={user.uid} onClose={() => setShowCertificate(false)} />
      )}

      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1">
          <p className="text-xs font-medium text-primary">{course.category}</p>
          <h1 className="text-2xl font-bold font-display text-foreground">{course.title}</h1>
          <p className="text-sm text-muted-foreground">by {course.instructor}</p>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="glass-card rounded-xl p-5 space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Overall Progress</span>
          <span className="font-bold text-primary">{progressPercentage}%</span>
        </div>
        <Progress value={progressPercentage} className="h-3" />
        <div className="flex gap-4 text-xs text-muted-foreground flex-wrap items-center">
          <span>{courseProgress.completedClasses}/{course.totalClasses} classes completed</span>
          <span>Quiz Score: {courseProgress.quizScore}%</span>
          {isCompleted && (
            <Badge className="gradient-bg text-primary-foreground ml-auto">✓ Completed</Badge>
          )}
          {isCompleted && (
            <Button size="sm" className="gradient-bg text-primary-foreground gap-1.5" onClick={() => setShowCertificate(true)}>
              <Award className="w-3.5 h-3.5" /> View Certificate
            </Button>
          )}
        </div>
      </motion.div>

      <Tabs defaultValue="schedule" className="space-y-4">
        <TabsList className="glass-card w-full justify-start gap-1 p-1 h-auto flex-wrap">
          <TabsTrigger value="schedule" className="gap-1.5 data-[state=active]:gradient-bg data-[state=active]:text-primary-foreground"><Calendar className="w-4 h-4" />Schedule</TabsTrigger>
          <TabsTrigger value="recordings" className="gap-1.5 data-[state=active]:gradient-bg data-[state=active]:text-primary-foreground"><Video className="w-4 h-4" />Recordings</TabsTrigger>
          <TabsTrigger value="notes" className="gap-1.5 data-[state=active]:gradient-bg data-[state=active]:text-primary-foreground"><FileText className="w-4 h-4" />Notes</TabsTrigger>
          <TabsTrigger value="announcements" className="gap-1.5 data-[state=active]:gradient-bg data-[state=active]:text-primary-foreground"><Megaphone className="w-4 h-4" />Announcements</TabsTrigger>
          <TabsTrigger value="quizzes" className="gap-1.5 data-[state=active]:gradient-bg data-[state=active]:text-primary-foreground"><BrainCircuit className="w-4 h-4" />Quizzes</TabsTrigger>
        </TabsList>

        <AnimatePresence mode="wait">
          <TabsContent value="schedule" className="space-y-3">
            {course.schedule.map((item, i) => (
              <motion.div key={item.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass-card rounded-xl p-4 flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {item.status === "live" && <Radio className="w-4 h-4 text-destructive animate-pulse" />}
                    {item.status === "completed" && <CheckCircle2 className="w-4 h-4 text-primary" />}
                    {item.status === "upcoming" && <Clock className="w-4 h-4 text-muted-foreground" />}
                    <h3 className="font-semibold text-card-foreground">{item.topic}</h3>
                  </div>
                  <p className="text-xs text-muted-foreground">{item.date} · {item.time}</p>
                </div>
                <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                  <Badge variant="outline" className={statusColors[item.status]}>{item.status === "live" ? "🔴 Live" : item.status}</Badge>
                  {(item.status === "live" || item.status === "upcoming") && item.meetLink && (
                    <Button size="sm" className="gradient-bg text-primary-foreground gap-1" asChild>
                      <a href={item.meetLink} target="_blank" rel="noreferrer">
                        <ExternalLink className="w-3.5 h-3.5" />Join
                      </a>
                    </Button>
                  )}
                  {courseProgress.completedLessons?.includes(item.id) ? (
                    <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20"><CheckCircle2 className="w-3.5 h-3.5 mr-1" />Completed</Badge>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-1 border-primary/20 hover:bg-primary/5 hover:text-primary whitespace-nowrap disabled:opacity-50"
                      onClick={() => startLessonQuiz(item)}
                      disabled={!isClassCompleted(item.date, item.time)}
                      title={!isClassCompleted(item.date, item.time) ? "You can only mark this complete after the class ends." : ""}
                    >
                      {isClassCompleted(item.date, item.time) ? "Mark Completed" : "Class Pending"}
                    </Button>
                  )}
                </div>
              </motion.div>
            ))}
          </TabsContent>

          <TabsContent value="recordings" className="space-y-3">
            {course.schedule.filter(s => s.status === "completed" && s.recordingUrl).map((item, i) => (
              <motion.div key={item.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass-card rounded-xl p-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Video className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-card-foreground">{item.topic}</h3>
                  <p className="text-xs text-muted-foreground">{item.date}</p>
                </div>
                <Button size="sm" variant="outline" className="gap-1" asChild>
                  <a href={item.recordingUrl} target="_blank" rel="noreferrer">Watch Recording</a>
                </Button>
              </motion.div>
            ))}
            {course.schedule.filter(s => s.status === "completed" && s.recordingUrl).length === 0 && (
              <p className="text-center text-muted-foreground py-8">No recordings available yet</p>
            )}
          </TabsContent>

          <TabsContent value="notes" className="space-y-3">
            {course.notes.map((note, i) => (
              <motion.div key={note.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass-card rounded-xl p-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-accent" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-card-foreground">{note.title}</h3>
                  <p className="text-xs text-muted-foreground">{note.description}</p>
                </div>
                <Button size="sm" variant="outline" className="gap-1" asChild>
                  <a href={note.fileUrl} target="_blank" rel="noreferrer" download>
                    <Download className="w-3.5 h-3.5" /> Download
                  </a>
                </Button>
              </motion.div>
            ))}
          </TabsContent>

          <TabsContent value="announcements" className="space-y-3">
            {course.announcements.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No announcements</p>
            ) : course.announcements.map((ann, i) => (
              <motion.div key={ann.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className={`glass-card rounded-xl p-4 border-l-4 ${ann.priority === "urgent" ? "border-l-destructive" : "border-l-primary"}`}>
                <div className="flex items-center gap-2 mb-1">
                  <Megaphone className="w-4 h-4 text-primary" />
                  <h3 className="font-semibold text-card-foreground">{ann.title}</h3>
                  {ann.priority === "urgent" && <Badge variant="destructive" className="text-xs">Urgent</Badge>}
                </div>
                <p className="text-sm text-muted-foreground">{ann.message}</p>
                <p className="text-xs text-muted-foreground mt-2">{ann.date}</p>
              </motion.div>
            ))}
          </TabsContent>

          <TabsContent value="quizzes" className="space-y-3">
            {course.finalQuiz ? (
              (() => {
                const isQuizPassed = courseProgress.quizScore >= 60;
                const allClassesCompleted = courseProgress.completedClasses === course.totalClasses;
                const isLocked = !allClassesCompleted;

                return (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`glass-card rounded-xl p-6 space-y-4 ${isLocked ? "opacity-60" : ""}`}>
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 ${isQuizPassed ? "bg-primary/10" : "gradient-bg"}`}>
                        <BrainCircuit className={`w-6 h-6 ${isQuizPassed ? "text-primary" : "text-primary-foreground"}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-card-foreground text-lg">{course.finalQuiz.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{course.finalQuiz.questions.length} questions • {course.finalQuiz.topic}</p>

                        {isQuizPassed && (
                          <div className="mt-3 p-3 bg-primary/10 rounded-lg border border-primary/20">
                            <p className="text-sm text-primary font-medium">✓ Passed with {courseProgress.quizScore}%</p>
                          </div>
                        )}

                        {isLocked && (
                          <div className="mt-3 p-3 bg-destructive/10 rounded-lg border border-destructive/20">
                            <p className="text-sm text-destructive font-medium">🔒 Unlocks after all classes completed</p>
                            <p className="text-xs text-destructive/70 mt-1">Progress: {courseProgress.completedClasses}/{course.totalClasses} classes</p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                      <Button
                        size="sm"
                        className="gap-2"
                        onClick={() => course.finalQuiz && setActiveQuiz(course.finalQuiz)}
                        disabled={isLocked || isQuizPassed}
                        variant={isLocked || isQuizPassed ? "outline" : "default"}
                      >
                        <BrainCircuit className="w-4 h-4" />
                        {isQuizPassed ? "Completed" : isLocked ? "Locked" : "Start Final Exam"}
                      </Button>
                      {!isQuizPassed && !isLocked && (
                        <p className="text-xs text-muted-foreground my-auto">Pass rate: 60% required to pass</p>
                      )}
                    </div>
                  </motion.div>
                );
              })()
            ) : (
              <div className="glass-card rounded-xl p-8 text-center space-y-3">
                <BrainCircuit className="w-12 h-12 mx-auto opacity-30 text-muted-foreground" />
                <div>
                  <p className="font-semibold text-card-foreground">Final Exam</p>
                  <p className="text-sm text-muted-foreground">Unlocks after all classes are completed</p>
                </div>
              </div>
            )}
          </TabsContent>
        </AnimatePresence>
      </Tabs>
    </div>
  );
};

export default CourseDetail;
