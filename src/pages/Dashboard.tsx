import { motion } from "framer-motion";
import { LoadingScreen } from "@/components/LoadingScreen";
import { useAuth } from "@/lib/auth-context";
import { usePaidCourses } from "@/hooks/usePaidCourses";
import CourseCard from "@/components/CourseCard";
import { BookOpen, Trophy, Clock, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

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

const Dashboard = () => {
  const { user } = useAuth();
  const { data: paidCourses = [], isLoading: coursesLoading } = usePaidCourses();
  const avgProgress = Math.round(paidCourses.reduce((a, c) => a + c.progress, 0) / paidCourses.length) || 0;
  const liveCount = paidCourses.reduce((a, c) => a + c.schedule.filter((s) => s.status === "live").length, 0);

  return (
    <div className="p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold font-display text-foreground">
          Welcome back, <span className="gradient-text">{user?.name?.split(" ")[0]}</span>
        </h1>
        <p className="text-muted-foreground mt-1">Continue where you left off</p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard icon={BookOpen} label="Paid Courses" value={String(paidCourses.length)} color="gradient-bg" />
        <StatCard icon={Trophy} label="Avg Progress" value={`${avgProgress}%`} color="bg-accent" />
        <StatCard icon={Clock} label="Live Classes" value={String(liveCount)} color="bg-destructive" />
      </div>

      <div>
        <h2 className="text-xl font-bold font-display text-foreground mb-4">My Courses</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coursesLoading ? (
            <div className="col-span-full">
              <LoadingScreen message="Loading your courses..." fullScreen={false} />
            </div>
          ) : paidCourses.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
              <p className="text-muted-foreground mb-4">No paid courses yet. Explore our course catalog!</p>
              <Button asChild>
                <a href="/courses">Browse All Courses</a>
              </Button>
            </div>
          ) : (
            paidCourses.map((course, i) => (
              <CourseCard key={course.id} course={course} index={i} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
