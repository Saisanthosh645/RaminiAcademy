import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ArrowRight,
  Clock,
  Users,
  Award,
  CheckCircle2,
  Lock,
  IndianRupee,
  BookOpen,
  AlertCircle,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Course } from "@/types/firebase";
import { onSnapshot } from "firebase/firestore";
import { coursesCollection } from "@/firebase/firestore";
import { useCourse } from "@/hooks/useCourse";

const Courses = () => {
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();
  const { toast } = useToast();
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [paidCourses, setPaidCourses] = useState<string[]>(user?.paidCourses || []);
  const [isEnrolling, setIsEnrolling] = useState(false);
  const { data: selectedCourseFromDashboard } = useCourse({ courseId: selectedCourse?.id || "" });
  const selectedCourseData = selectedCourseFromDashboard ?? selectedCourse;

  useEffect(() => {
    if (isLoading || !user) {
      return;
    }

    const unsub = onSnapshot(
      coursesCollection,
      (snapshot) => {
        const firebaseCourses = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...(docSnap.data() as Omit<Course, "id">),
        }));
        setAllCourses(firebaseCourses);
      },
      (error) => {
        console.error("Error subscribing to courses:", error);
      }
    );

    return () => unsub();
  }, [isLoading, user?.uid]);

  useEffect(() => {
    setPaidCourses(user?.paidCourses || []);
  }, [user]);

  const isPurchased = (courseId: string) => paidCourses.includes(courseId);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 p-6 lg:p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-12">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-4">
          <h1 className="text-4xl lg:text-5xl font-bold font-display gradient-text">All Courses</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Master new skills with our comprehensive course catalog. Pay once, learn forever.
          </p>
        </motion.div>
      </div>

      {/* Courses Grid */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {allCourses.map((course, i) => {
              const isPaid = isPurchased(course.id);
              const discount = course.originalPrice ? Math.round(((course.originalPrice - course.price) / course.originalPrice) * 100) : 0;
              const isFull = course.capacity !== undefined && course.enrolledCount !== undefined && course.enrolledCount >= course.capacity;

              return (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -8 }}
                  className="h-full"
                >
                  <Card className={`glass-card rounded-2xl overflow-hidden group h-full flex flex-col hover:shadow-lg transition-shadow relative border border-border/50 ${isFull ? 'opacity-75' : ''}`}>
                    {/* Badges */}
                    <div className="absolute top-4 right-4 z-10 flex flex-col items-end gap-2">
                      <div className="flex gap-2">
                        {isPaid && (
                          <Badge className="gradient-bg text-primary-foreground gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Purchased
                          </Badge>
                        )}
                        {isFull && (
                          <Badge className="bg-red-500 text-white gap-1">
                            Full
                          </Badge>
                        )}
                        <Badge variant="outline" className="bg-background shadow-sm border-border/50">
                          {course.level}
                        </Badge>
                      </div>
                      {discount > 0 && (
                        <div className="px-2.5 py-1 rounded-full bg-green-500 text-white text-[10px] font-black uppercase tracking-wider shadow-lg shadow-green-500/30 border border-white/10">
                          {discount}% OFF
                        </div>
                      )}
                    </div>

                    {course.isBestSeller && (
                      <div className="absolute top-4 left-4 z-10 px-2.5 py-1 rounded-full bg-amber-500 text-white text-[10px] font-black uppercase tracking-wider shadow-lg shadow-amber-500/30 border border-white/10 flex items-center gap-1">
                        <Award className="w-3 h-3" />
                        Best Seller
                      </div>
                    )}

                    {/* Thumbnail */}
                    <div className="relative h-48 overflow-hidden bg-gradient-to-br from-primary/20 to-accent/20">
                      <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      {!isPaid && (
                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Lock className="w-8 h-8 text-white" />
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-6 flex-1 flex flex-col space-y-4">
                      <div>
                        <p className="text-xs font-medium text-primary mb-2">{course.category}</p>
                        <h3 className="font-bold text-lg text-card-foreground line-clamp-2 group-hover:text-primary transition-colors">
                          {course.title}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-2">by {course.instructor}</p>
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div className="glass-card rounded-lg p-2 text-center">
                          <p className="font-semibold text-card-foreground">{course.totalClasses}</p>
                          <p className="text-muted-foreground">Classes</p>
                        </div>
                        <div className="glass-card rounded-lg p-2 text-center">
                          <p className="font-semibold text-card-foreground">{course.duration}</p>
                          <p className="text-muted-foreground">Duration</p>
                        </div>
                        <div className="glass-card rounded-lg p-2 text-center flex flex-col items-center justify-center">
                          <Award className="w-3 h-3 text-primary mb-1" />
                          <p className="text-muted-foreground">Cert.</p>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="flex items-center gap-3 pt-2 border-t border-border/30">
                        <div className="bg-indigo-600 text-white px-3 py-1 rounded-lg font-black flex items-center gap-1 shadow-[0_0_15px_rgba(79,70,229,0.3)] text-base group-hover:scale-105 transition-transform duration-300 ring-1 ring-white/20">
                          <span>₹</span>
                          <span>{course.price}</span>
                        </div>
                        {course.originalPrice && (
                          <span className="text-sm text-muted-foreground/40 line-through font-medium">
                            ₹{course.originalPrice}
                          </span>
                        )}
                        <div className="ml-auto flex flex-col items-end leading-none">
                          <span className="text-[9px] uppercase tracking-tighter font-bold text-primary animate-pulse mb-0.5">Limited Time</span>
                          <span className="text-[8px] uppercase tracking-tighter font-semibold text-muted-foreground opacity-30">one-time</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="p-6 pt-0 space-y-2">
                      <Button
                        onClick={() => {
                          if (isFull && (course.id === "web-dev-basics" || course.id === "dsa-python")) {
                            toast({
                              title: "Seats Filled",
                              description: "Sorry, all seats for this course are currently filled. Please check back later or contact support.",
                              variant: "destructive",
                            });
                            return;
                          }
                          if (!isFull) {
                            setSelectedCourse(course);
                          }
                        }}
                        variant={isPaid ? "outline" : "default"}
                        className={`w-full ${isPaid ? "" : (isFull && (course.id === "web-dev-basics" || course.id === "dsa-python")) ? "bg-orange-500 hover:bg-orange-600 text-white" : isFull ? "bg-red-500 text-white cursor-not-allowed" : "gradient-bg text-primary-foreground"} gap-2`}
                        disabled={isFull && !(course.id === "web-dev-basics" || course.id === "dsa-python")}
                      >
                        {isFull && (course.id === "web-dev-basics" || course.id === "dsa-python") ? (
                          <>
                            Seats Filled
                          </>
                        ) : isFull ? (
                          <>
                            Full
                          </>
                        ) : isPaid ? (
                          <>
                            <CheckCircle2 className="w-4 h-4" /> View Course
                          </>
                        ) : (
                          <>
                            View Details <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </Button>
                      {isPaid && (
                        <Button
                          onClick={() => navigate(`/courses/${course.id}`)}
                          variant="ghost"
                          className="w-full text-primary hover:text-primary"
                        >
                          Go to Course →
                        </Button>
                      )}
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      <Dialog 
        open={!!selectedCourse} 
        onOpenChange={(open) => {
          if (!open) {
            setSelectedCourse(null);
            setTimeout(() => {
              setIsEnrolling(false);
            }, 300);
          }
        }}
      >
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedCourseData && (
            <AnimatePresence mode="wait">
              {isEnrolling ? (
                <motion.div key="payment" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.2 }} className="space-y-6 flex flex-col items-center py-4">
                  <div className="text-center space-y-2">
                    <h2 className="text-2xl font-bold font-display gradient-text">Secure UPI Payment</h2>
                    <p className="text-muted-foreground">{selectedCourseData.title}</p>
                    <div className="flex items-center justify-center gap-3 mt-4 mb-2">
                      <div className="bg-indigo-600 text-white px-5 py-2 rounded-lg font-bold flex items-center gap-1.5 shadow-xl text-2xl">
                        <span>₹</span>
                        <span>{selectedCourseData.price}</span>
                      </div>
                      {selectedCourseData.originalPrice && (
                        <div className="text-base text-muted-foreground line-through opacity-30">₹{selectedCourseData.originalPrice}</div>
                      )}
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-2xl shadow-sm border border-border/50">
                    <img 
                      src="/images/upi-qr.jpeg" 
                      alt="UPI QR Code" 
                      onError={(e) => { e.currentTarget.src = 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=replace@upi&pn=Nova%20Learn'; }}
                      className="w-48 h-48 object-contain rounded-lg" 
                    />
                  </div>
                  
                  <p className="text-sm text-center text-muted-foreground max-w-sm">
                    Scan this QR code using PhonePe, Google Pay, Paytm, or any UPI app to pay easily.
                  </p>

                  <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-4 max-w-md w-full mt-4">
                    <div className="flex gap-3">
                      <AlertCircle className="w-6 h-6 text-destructive shrink-0 mt-0.5" />
                      <div className="text-sm text-destructive font-medium">
                        <p className="font-bold mb-1 uppercase tracking-wider text-xs">Mandatory Verification Step</p>
                        <p className="leading-relaxed text-foreground/80">After payment, you must share the <span className="font-bold">transaction receipt</span>, <span className="font-bold">Course Name</span>, <span className="font-bold">Your Full Name</span>, and <span className="font-bold">Email ID</span> to our WhatsApp number to activate your course.</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md mt-6">
                    <Button variant="outline" className="flex-1 py-6 border-primary/20 hover:bg-primary/5" onClick={() => setIsEnrolling(false)}>
                      Back to Details
                    </Button>
                    <a
                      href={`https://wa.me/919063019758?text=${encodeURIComponent(`Hi, I have just paid for the course "${selectedCourseData.title}".\n\nMy Details:\n- Name: ${user?.name || ""}\n- Email: ${user?.email || ""}\n- Amount Paid: ₹${selectedCourseData.price}\n\n[Please find the payment receipt attached below.]`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-[2] bg-[#25D366] hover:bg-[#20bd5a] text-white py-6 rounded-md font-bold flex items-center justify-center shadow-lg transition-transform hover:scale-[1.02] active:scale-[0.98]"
                    >
                      Share Receipt on WhatsApp
                    </a>
                  </div>
                </motion.div>
              ) : (
                <motion.div key="details" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }} className="space-y-6">
              {/* Header */}
              <div className="space-y-2">
                <DialogHeader>
                  <DialogTitle className="text-2xl gradient-text">{selectedCourseData.title}</DialogTitle>
                  <DialogDescription className="text-base">{selectedCourseData.description}</DialogDescription>
                </DialogHeader>
              </div>

              <Tabs defaultValue="overview" className="space-y-4">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="syllabus">Syllabus</TabsTrigger>
                  <TabsTrigger value="details">Details</TabsTrigger>
                </TabsList>

                {/* Overview Tab */}
                <TabsContent value="overview" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1 p-4 bg-primary/5 rounded-lg">
                      <p className="text-xs text-muted-foreground">Instructor</p>
                      <p className="font-semibold text-card-foreground">{selectedCourseData.instructor}</p>
                    </div>
                    <div className="space-y-1 p-4 bg-accent/5 rounded-lg">
                      <p className="text-xs text-muted-foreground">Level</p>
                      <p className="font-semibold text-card-foreground">{selectedCourseData.level}</p>
                    </div>
                    <div className="space-y-1 p-4 bg-primary/5 rounded-lg">
                      <p className="text-xs text-muted-foreground">Duration</p>
                      <p className="font-semibold text-card-foreground">{selectedCourseData.duration}</p>
                    </div>
                    <div className="space-y-1 p-4 bg-accent/5 rounded-lg">
                      <p className="text-xs text-muted-foreground">Classes</p>
                      <p className="font-semibold text-card-foreground">{selectedCourseData.totalClasses} Sessions</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{selectedCourseData.description}</p>
                </TabsContent>

                {/* Syllabus Tab */}
                <TabsContent value="syllabus" className="space-y-3">
                  {selectedCourseData.syllabus && selectedCourseData.syllabus.length > 0 ? (
                    <div className="space-y-2">
                      {selectedCourseData.syllabus.map((item, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className="p-3 bg-muted/30 rounded-lg border border-border/50"
                        >
                          <div className="flex gap-3">
                            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-semibold text-primary">
                              W{item.week}
                            </div>
                            <div>
                              <p className="font-semibold text-card-foreground">{item.topic}</p>
                              <p className="text-xs text-muted-foreground mt-1">{item.description}</p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-muted-foreground py-4">Syllabus coming soon</p>
                  )}
                </TabsContent>

                {/* Details Tab */}
                <TabsContent value="details" className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg border border-border/50">
                      <BookOpen className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-xs text-muted-foreground">Total Content</p>
                        <p className="font-semibold text-card-foreground">{selectedCourseData.totalClasses} Classes + Recordings + Resources</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border border-border/50">
                      <div className="flex items-center gap-3">
                        <Award className="w-5 h-5 text-accent" />
                        <div>
                          <p className="text-xs text-muted-foreground">Certification</p>
                          <p className="font-semibold text-card-foreground">Professional Certificate</p>
                        </div>
                      </div>
                      </div>
                    <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg border border-border/50">
                      <Users className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-xs text-muted-foreground">Support</p>
                        <p className="font-semibold text-card-foreground">24/7 Instructor Support</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              {/* Pricing & Payment */}
              <div className="space-y-4 pt-4 border-t border-border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5 font-semibold opacity-70">Total Investment</p>
                    <div className="flex items-center gap-2.5">
                      <div className="bg-indigo-600 text-white px-3.5 py-1.5 rounded-md font-bold flex items-center gap-1.5 shadow-lg text-lg">
                        <span>₹</span>
                        <span>{selectedCourseData.price}</span>
                      </div>
                      {selectedCourseData.originalPrice && (
                        <span className="text-sm text-muted-foreground line-through opacity-50">
                          ₹{selectedCourseData.originalPrice}
                        </span>
                      )}
                      <span className="text-[10px] uppercase tracking-tighter font-semibold text-muted-foreground ml-auto opacity-40">one-time payment</span>
                    </div>
                  </div>
                </div>

                {isPurchased(selectedCourseData.id) ? (
                  <Button
                    onClick={() => {
                      navigate(`/courses/${selectedCourseData.id}`);
                      setSelectedCourse(null);
                    }}
                    className="w-full gradient-bg text-primary-foreground h-12 text-base"
                  >
                    <CheckCircle2 className="w-5 h-5 mr-2" /> Go to Course
                  </Button>
                ) : (
                  <motion.div className="space-y-2">
                    <Button
                      onClick={() => setIsEnrolling(true)}
                      className="w-full gradient-bg text-primary-foreground h-12 text-base rounded-md px-4 py-2 font-medium flex items-center justify-center gap-2"
                    >
                      <Lock className="w-4 h-4" /> Enroll Now
                    </Button>
                  </motion.div>
                )}
              </div>
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Courses;
