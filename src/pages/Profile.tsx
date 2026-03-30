import { motion } from "framer-motion";
import { useAuth } from "@/lib/auth-context";
import { usePaidCourses } from "@/hooks/usePaidCourses";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LogOut, BookOpen, TrendingUp, Award, Calendar, Mail, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { user, logout } = useAuth();
  const { data: paidCourses = [] } = usePaidCourses();
  const navigate = useNavigate();

  const avgProgress = paidCourses.length
    ? Math.round(paidCourses.reduce((a, c) => a + c.progress, 0) / paidCourses.length)
    : 0;

  const completedCount = paidCourses.filter(c => c.progress === 100).length;

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-IN", { month: "long", year: "numeric" })
    : "—";

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const initials = user?.name?.split(" ").map(n => n[0]).join("").toUpperCase() || "U";

  const stats = [
    { icon: BookOpen, label: "Courses Purchased", value: String(paidCourses.length), color: "text-primary" },
    { icon: TrendingUp, label: "Avg Progress", value: `${avgProgress}%`, color: "text-accent" },
    { icon: Award, label: "Completed", value: String(completedCount), color: "text-green-500" },
  ];

  return (
    <div className="p-6 lg:p-8 max-w-2xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold font-display text-foreground">Profile</h1>
        <p className="text-muted-foreground text-sm mt-1">Your learning account</p>
      </motion.div>

      {/* Avatar & Basic Info */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card rounded-2xl p-8 flex flex-col items-center gap-4 text-center"
      >
        <div className="relative">
          <Avatar className="w-24 h-24">
            <AvatarFallback className="gradient-bg text-primary-foreground text-3xl font-display font-bold">
              {initials}
            </AvatarFallback>
          </Avatar>
          {completedCount > 0 && (
            <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full gradient-bg flex items-center justify-center border-2 border-background">
              <Award className="w-4 h-4 text-primary-foreground" />
            </div>
          )}
        </div>

        <div>
          <h2 className="text-2xl font-bold font-display text-card-foreground">{user?.name}</h2>
          <div className="flex items-center justify-center gap-1.5 text-sm text-muted-foreground mt-1">
            <Mail className="w-3.5 h-3.5" />
            <span>{user?.email}</span>
          </div>
          <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground mt-1">
            <Calendar className="w-3.5 h-3.5" />
            <span>Member since {memberSince}</span>
          </div>
          {completedCount > 0 && (
            <Badge className="gradient-bg text-primary-foreground mt-3 gap-1">
              <Award className="w-3 h-3" /> {completedCount} Course{completedCount > 1 ? "s" : ""} Completed
            </Badge>
          )}
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 + i * 0.05 }}
            className="glass-card rounded-xl p-5 text-center space-y-2"
          >
            <stat.icon className={`w-5 h-5 mx-auto ${stat.color}`} />
            <p className="text-2xl font-bold font-display gradient-text">{stat.value}</p>
            <p className="text-xs text-muted-foreground leading-tight">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Account Info */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card rounded-2xl p-6 space-y-4"
      >
        <h3 className="font-semibold text-card-foreground flex items-center gap-2">
          <User className="w-4 h-4 text-primary" /> Account Details
        </h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center py-2 border-b border-border/40">
            <span className="text-sm text-muted-foreground">Full Name</span>
            <span className="text-sm font-medium text-card-foreground">{user?.name}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-border/40">
            <span className="text-sm text-muted-foreground">Email Address</span>
            <span className="text-sm font-medium text-card-foreground">{user?.email}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-border/40">
            <span className="text-sm text-muted-foreground">Account Type</span>
            <Badge variant="outline" className="text-primary border-primary/30">Student</Badge>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-sm text-muted-foreground">Member Since</span>
            <span className="text-sm font-medium text-card-foreground">{memberSince}</span>
          </div>
        </div>
      </motion.div>

      {/* Courses quick link */}
      {paidCourses.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
          className="glass-card rounded-2xl p-6 text-center space-y-3"
        >
          <BookOpen className="w-10 h-10 mx-auto text-muted-foreground/40" />
          <p className="text-sm text-muted-foreground">You haven't purchased any courses yet.</p>
          <Button className="gradient-bg text-primary-foreground" onClick={() => navigate("/courses")}>
            Browse All Courses
          </Button>
        </motion.div>
      )}

      {/* Logout */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
        <Button
          variant="outline"
          className="w-full text-destructive border-destructive/30 hover:bg-destructive/5 hover:border-destructive/60 gap-2"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4" /> Sign Out
        </Button>
      </motion.div>
    </div>
  );
};

export default Profile;
