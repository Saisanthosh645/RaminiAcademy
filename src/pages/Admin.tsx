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
import { migrateCoursesToFirebase, updateCourseInFirebase, getAllCoursesFromFirebase, bulkUpdateZoomLinks } from "@/firebase/migration";
import type { Course } from "@/types/firebase";
import { Loader2, Save, RefreshCw, Link, Calendar, Users, BookOpen } from "lucide-react";
import CourseEditor from "@/components/CourseEditor";

const Admin = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [bulkZoomLinks, setBulkZoomLinks] = useState<Record<string, string>>({});

  // Only allow access to specific admin users
  const isAdmin = user?.email === "raminisaisanthosh@gmail.com" || user?.uid === "admin-user-id";

  useEffect(() => {
    if (isAdmin) {
      loadCourses();
    }
  }, [isAdmin]);

  const loadCourses = async () => {
    setLoading(true);
    const firebaseCourses = await getAllCoursesFromFirebase();
    if (firebaseCourses.length === 0) {
      // If no courses in Firebase, show local data
      const { courses: localCourses } = await import("@/firebase/seedCourses");
      setCourses(localCourses);
    } else {
      setCourses(firebaseCourses);
    }
    setLoading(false);
  };

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

  const handleUpdateCourse = async (courseId: string, updates: any) => {
    const result = await updateCourseInFirebase(courseId, updates);
    if (result.success) {
      toast({
        title: "Course Updated",
        description: `Course ${courseId} has been updated successfully`,
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
        description: "All Zoom links have been updated",
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

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
          </CardHeader>
          <CardContent>
            <p>You don't have permission to access the admin panel.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Course Admin Panel</h1>
          <div className="flex gap-2">
            <Button onClick={loadCourses} variant="outline" disabled={loading}>
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button onClick={handleMigrateToFirebase} disabled={loading}>
              <Save className="w-4 h-4 mr-2" />
              Migrate to Firebase
            </Button>
          </div>
        </div>

        <Tabs defaultValue="courses" className="space-y-6">
          <TabsList>
            <TabsTrigger value="courses">Manage Courses</TabsTrigger>
            <TabsTrigger value="bulk-zoom">Bulk Zoom Links</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="courses" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <Card key={course.id} className="cursor-pointer hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg">{course.title}</CardTitle>
                    <div className="flex gap-2">
                      <Badge variant="outline">{course.category}</Badge>
                      <Badge variant="secondary">{course.level}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        <span>{course.enrolledCount || 0}/{course.capacity || '∞'} enrolled</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4" />
                        <span>{course.totalClasses} classes</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{course.duration}</span>
                      </div>
                    </div>
                    <Button
                      className="w-full mt-4"
                      onClick={() => setSelectedCourse(course)}
                    >
                      Edit Course
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="bulk-zoom" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Link className="w-5 h-5" />
                  Bulk Update Zoom Links
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {courses.map((course) => (
                  <div key={course.id} className="flex items-center gap-4">
                    <Label className="w-48">{course.title}</Label>
                    <Input
                      placeholder="https://zoom.us/j/..."
                      value={bulkZoomLinks[course.id] || ""}
                      onChange={(e) => setBulkZoomLinks(prev => ({
                        ...prev,
                        [course.id]: e.target.value
                      }))}
                      className="flex-1"
                    />
                  </div>
                ))}
                <Button
                  onClick={handleBulkUpdateZoom}
                  disabled={loading || Object.keys(bulkZoomLinks).length === 0}
                  className="w-full"
                >
                  {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Update All Zoom Links
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Total Courses</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{courses.length}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Total Enrollments</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {courses.reduce((sum, course) => sum + (course.enrolledCount || 0), 0)}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Active Courses</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {courses.filter(course => (course.enrolledCount || 0) > 0).length}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Course Editor */}
        {selectedCourse && (
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