import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { BookOpen, ArrowRight, Radio, IndianRupee, Award } from "lucide-react";
import type { Course } from "@/types/firebase";

interface CourseCardProps {
  course: Course;
  index: number;
}

const CourseCard = ({ course, index }: CourseCardProps) => {
  const navigate = useNavigate();
  const hasLive = course.schedule.some((s) => s.status === "live");
  const discount = course.originalPrice ? Math.round(((course.originalPrice - course.price) / course.originalPrice) * 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="glass-card rounded-2xl p-6 glow-border cursor-pointer group relative overflow-hidden"
      onClick={() => navigate(`/courses/${course.id}`)}
    >
      <div className="absolute top-4 right-4 flex flex-col items-end gap-2 z-20">
        {hasLive && (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-destructive/10 text-destructive text-[10px] font-bold uppercase tracking-wider backdrop-blur-md border border-destructive/20 shadow-sm">
            <Radio className="w-3 h-3 animate-pulse" />
            Live Now
          </div>
        )}
        {discount > 0 && (
          <div className="px-2.5 py-1 rounded-full bg-green-500 text-white text-[10px] font-black uppercase tracking-wider shadow-lg shadow-green-500/30 border border-white/20">
            {discount}% OFF
          </div>
        )}
      </div>

      {course.isBestSeller && (
        <div className="absolute top-4 left-4 z-20 px-2.5 py-1 rounded-full bg-amber-500 text-white text-[10px] font-black uppercase tracking-wider shadow-lg shadow-amber-500/30 border border-white/20 flex items-center gap-1">
          <Award className="w-3 h-3" />
          Best Seller
        </div>
      )}

      <div className="flex items-start gap-4 mb-4 mt-8">
        <div className="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center shrink-0">
          <BookOpen className="w-6 h-6 text-primary-foreground" />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-medium text-primary mb-1">{course.category} • {course.level}</p>
          <h3 className="font-display font-bold text-card-foreground text-lg leading-tight">{course.title}</h3>
          <p className="text-sm text-muted-foreground mt-1">{course.instructor} • {course.duration}</p>
        </div>
      </div>

      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{course.description}</p>

      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-xs">
          <span className="text-muted-foreground">{course.completedClasses}/{course.totalClasses} classes</span>
          <span className="font-semibold text-primary">{course.progress}%</span>
        </div>
        <Progress value={course.progress} className="h-2" />
      </div>

      {/* Price */}
      <div className="flex items-center gap-3 pb-4 mb-4 border-b border-border/30">
        <div className="bg-indigo-600 text-white px-3 py-1 rounded-lg font-black flex items-center gap-1 shadow-[0_0_15px_rgba(79,70,229,0.3)] text-base group-hover:scale-105 transition-transform duration-300 ring-1 ring-white/20">
          <span>₹</span>
          <span>{course.price || 99}</span>
        </div>
        {course.originalPrice && (
          <span className="text-sm text-muted-foreground/40 line-through font-medium">
            ₹{course.originalPrice}
          </span>
        )}
        <div className="ml-auto flex flex-col items-end leading-none">
          <span className="text-[9px] uppercase tracking-tighter font-bold text-primary animate-pulse mb-0.5">Limited Offer</span>
          <span className="text-[8px] uppercase tracking-tighter font-semibold text-muted-foreground opacity-30">one-time payment</span>
        </div>
      </div>

      <Button variant="ghost" className="w-full justify-between text-primary group-hover:bg-primary/5">
        Continue Learning
        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
      </Button>
    </motion.div>
  );
};

export default CourseCard;

