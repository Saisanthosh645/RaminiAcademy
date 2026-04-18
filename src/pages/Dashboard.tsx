import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { LoadingScreen } from "@/components/LoadingScreen";
import { useAuth } from "@/lib/auth-context";
import { usePaidCourses } from "@/hooks/usePaidCourses";
import CourseCard from "@/components/CourseCard";
import { BookOpen, Trophy, Clock, ArrowRight, Play, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";
import { onSnapshot } from "firebase/firestore";
import { coursesCollection } from "@/firebase/firestore";
import type { Course } from "@/types/firebase";

const StatCard = ({ icon: Icon, label, value, color }: { icon: LucideIcon; label: string; value: string; color: string }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    className="glass-card rounded-xl p-5 flex items-center gap-4"
  >
    <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${color}`}>
      <Icon className="w-5 h-5 text-primary-foreground" />
    </div>
    <div>
      <p className="text-2xl font-bold font-display text-card-foreground">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  </motion.div>
);

const ResumeHero = ({ course }: { course: any }) => {
  const navigate = useNavigate();
  if (!course) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-3xl group cursor-pointer"
      onClick={() => navigate(`/courses/${course.id}`)}
    >
      {/* Background with blurred thumbnail */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent z-10" />
        <img 
          src={course.thumbnail} 
          alt="" 
          className="w-full h-full object-cover scale-110 blur-xl opacity-20 group-hover:scale-100 transition-transform duration-700" 
        />
      </div>

      <div className="relative z-10 p-8 lg:p-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8 glass-card border-none bg-white/5 dark:bg-black/20">
        <div className="space-y-4 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest border border-primary/20">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            Resume Learning
          </div>
          
          <div>
            <h2 className="text-3xl lg:text-4xl font-bold font-display text-foreground leading-tight group-hover:gradient-text transition-all duration-300">
              {course.title}
            </h2>
            <p className="text-muted-foreground mt-2 text-lg line-clamp-1 opacity-80">
              {course.instructor} • {course.level}
            </p>
          </div>

          <div className="space-y-2 max-w-sm">
            <div className="flex justify-between text-xs font-medium text-muted-foreground">
              <span>Overall Progress</span>
              <span>{course.progress}%</span>
            </div>
            <Progress value={course.progress} className="h-2" />
          </div>
        </div>

        <Button size="lg" className="gradient-bg text-primary-foreground rounded-2xl h-16 px-8 gap-3 group/btn shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all duration-300">
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
            <Play className="w-4 h-4 fill-current ml-0.5" />
          </div>
          <span className="text-lg font-bold">Jump Back In</span>
          <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
        </Button>
      </div>
    </motion.div>
  );
};

const Dashboard = () => {
  const { user } = useAuth();
  const { data: paidCourses = [], isLoading: coursesLoading } = usePaidCourses();
  const [catalogCourses, setCatalogCourses] = useState<Course[]>([]);
  const [catalogLoading, setCatalogLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setCatalogCourses([]);
      setCatalogLoading(false);
      return;
    }

    setCatalogLoading(true);
    const unsub = onSnapshot(
      coursesCollection,
      (snapshot) => {
        const next = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...(docSnap.data() as Omit<Course, "id">),
        }));
        setCatalogCourses(next);
        setCatalogLoading(false);
      },
      (error) => {
        console.error("Error syncing dashboard courses:", error);
        setCatalogCourses([]);
        setCatalogLoading(false);
      }
    );

    return () => unsub();
  }, [user?.uid]);

  const dashboardCourses = paidCourses.length > 0 ? paidCourses : catalogCourses;
  const isDashboardLoading = coursesLoading || (paidCourses.length === 0 && catalogLoading);
  
  const avgProgress = Math.round(dashboardCourses.reduce((a, c) => a + c.progress, 0) / dashboardCourses.length) || 0;
  const liveCount = dashboardCourses.reduce((a, c) => a + c.schedule.filter((s) => s.status === "live").length, 0);
  
  const resumeCourse = [...dashboardCourses]
    .filter(c => c.progress > 0 && c.progress < 100)
    .sort((a, b) => b.progress - a.progress)[0] || dashboardCourses[0];

  return (
    <div className="p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl lg:text-4xl font-bold font-display text-foreground">
            Welcome back, <span className="gradient-text">{user?.name?.split(" ")[0]}</span>
          </h1>
          <p className="text-muted-foreground mt-1">Ready to master a new skill today?</p>
        </motion.div>
      </div>

      {dashboardCourses.length > 0 && <ResumeHero course={resumeCourse} />}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard icon={BookOpen} label="Available Courses" value={String(dashboardCourses.length)} color="gradient-bg" />
        <StatCard icon={Trophy} label="Avg Progress" value={`${avgProgress}%`} color="bg-accent" />
        <StatCard icon={Clock} label="Live Classes" value={String(liveCount)} color="bg-destructive" />
      </div>

      <div>
        <h2 className="text-xl font-bold font-display text-foreground mb-4">My Courses</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isDashboardLoading ? (
            <div className="col-span-full">
              <LoadingScreen message="Loading courses from Firebase..." fullScreen={false} />
            </div>
          ) : dashboardCourses.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
              <p className="text-muted-foreground mb-4">No courses available right now. Check back shortly.</p>
              <Button asChild>
                <a href="/courses">Browse All Courses</a>
              </Button>
            </div>
          ) : (
            dashboardCourses.map((course, i) => (
              <CourseCard key={course.id} course={course} index={i} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
