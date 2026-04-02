import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Clock, Video, CheckCircle2, AlertCircle, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  generateUserSchedule,
  getTodaySessions,
  getUpcomingSchedule,
  ScheduleSession,
} from "@/lib/scheduleGenerator";
import { useAuth } from "@/lib/auth-context";
import { usePaidCourses } from "@/hooks/usePaidCourses";

const ScheduleView = () => {
  const [sessions, setSessions] = useState<ScheduleSession[]>([]);
  const [todaySessions, setTodaySessions] = useState<ScheduleSession[]>([]);
  const [groupedSessions, setGroupedSessions] = useState<Record<string, ScheduleSession[]>>({});
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeWeek, setActiveWeek] = useState(0);

  const { user } = useAuth();
  const { data: userCourses = [] } = usePaidCourses();

  // Initialize and regenerate schedule periodically
  useEffect(() => {
    if (!userCourses || userCourses.length === 0) {
      setSessions([]);
      setTodaySessions([]);
      setGroupedSessions({});
      return;
    }
    
    const allSessions = generateUserSchedule(userCourses, 12);
    setSessions(allSessions);
    setTodaySessions(getTodaySessions(allSessions));
    setGroupedSessions({});
  }, [userCourses?.length]);

  // Update current time for status updates
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  const getStatusColor = (status: string): string => {
    switch (status) {
      case "completed":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "live":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      case "upcoming":
        return "bg-primary/10 text-primary border-primary/20";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="w-3.5 h-3.5" />;
      case "live":
        return <Zap className="w-3.5 h-3.5 animate-pulse" />;
      case "upcoming":
        return <AlertCircle className="w-3.5 h-3.5" />;
      default:
        return null;
    }
  };

  const getStatusLabel = (status: string): string => {
    switch (status) {
      case "completed":
        return "Completed";
      case "live":
        return "Live Now";
      case "upcoming":
        return "Upcoming";
      default:
        return status;
    }
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (time: string): string => {
    const [hours, mins] = time.split(":").map(Number);
    const ampm = hours >= 12 ? "PM" : "AM";
    const displayHours = hours % 12 || 12;
    return `${String(displayHours).padStart(2, "0")}:${String(mins).padStart(2, "0")} ${ampm}`;
  };

  const SessionCard = ({ session }: { session: ScheduleSession }) => (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      className="relative h-full"
    >
      <Card className={`h-full glass-card border-l-4 transition-all duration-300 ${
        session.status === "live" ? "border-l-red-500 shadow-lg shadow-red-500/10" : 
        session.status === "completed" ? "border-l-green-500" : 
        "border-l-primary"
      }`}>
        <div className="p-5 flex flex-col h-full justify-between gap-4">
          {/* Header */}
          <div className="space-y-2">
            <div className="flex items-start justify-between gap-3">
              <h3 className="font-bold text-foreground text-lg leading-tight line-clamp-2">{session.courseName}</h3>
              <Badge variant="outline" className={`${getStatusColor(session.status)} flex items-center gap-1.5 py-1 px-2.5 rounded-full text-[10px] uppercase font-bold tracking-wider border transition-colors`}>
                {getStatusIcon(session.status)}
                {getStatusLabel(session.status)}
              </Badge>
            </div>
            <p className="text-sm font-medium text-primary/80">{session.day}</p>
          </div>

          {/* Details */}
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm text-muted-foreground/90">
              <div className="w-8 h-8 rounded-full bg-muted/50 flex items-center justify-center">
                <Calendar className="w-4 h-4 text-primary" />
              </div>
              <span className="font-medium text-foreground/90">{formatDate(session.date)}</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-muted-foreground/90">
              <div className="w-8 h-8 rounded-full bg-muted/50 flex items-center justify-center">
                <Clock className="w-4 h-4 text-primary" />
              </div>
              <span className="font-medium text-foreground/90">
                {formatTime(session.startTime)} - {formatTime(session.endTime)}
              </span>
            </div>
          </div>

          {/* Action Button */}
          <div className="flex gap-2 pt-2 mt-auto">
            {session.status === "live" ? (
              <Button
                className="flex-1 gradient-bg text-primary-foreground font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform"
                onClick={() => window.open(session.zoomLink, "_blank")}
              >
                <Video className="w-4 h-4 mr-2" />
                Join Live Class
              </Button>
            ) : session.status === "upcoming" ? (
              <Button variant="secondary" className="flex-1 font-medium bg-secondary/50 backdrop-blur-sm" disabled>
                <Clock className="w-4 h-4 mr-2 opacity-50" />
                Wait for Session
              </Button>
            ) : (
              <Button variant="ghost" className="flex-1 font-medium bg-green-500/5 text-green-500/70 border border-green-500/10" disabled>
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Recorded Available
              </Button>
            )}
            <Button
              variant="outline"
              size="icon"
              className="rounded-xl border-border/40 hover:bg-muted/50 transition-colors"
              onClick={() => {
                navigator.clipboard.writeText(session.zoomLink);
                // toast is handled by parent or we could add here
              }}
              title="Copy Zoom Link"
            >
              <Video className="w-4 h-4 opacity-70" />
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );

  const TodayHighlight = () => {
    if (todaySessions.length === 0) {
      return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-12">
          <div className="glass-card rounded-2xl p-8 text-center border-dashed border-2">
            <Calendar className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground">No classes today</h3>
            <p className="text-muted-foreground mt-2">Enjoy your day or catch up on old recordings!</p>
          </div>
        </motion.div>
      );
    }

    return (
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center shadow-lg shadow-primary/20">
              <Zap className="w-5 h-5 text-primary-foreground animate-pulse" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">Today's Schedule</h2>
              <p className="text-sm text-muted-foreground">Don't miss these upcoming sessions</p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {todaySessions.map((session) => (
              <SessionCard key={session.id} session={session} />
            ))}
          </AnimatePresence>
        </div>
      </motion.div>
    );
  };

  const ScheduleGrid = () => {
    const allUpcomingSessions = getUpcomingSchedule(sessions);
    
    // Group by date
    const sessionsByDate: Record<string, ScheduleSession[]> = {};
    allUpcomingSessions.forEach((session) => {
      const dateKey = formatDate(session.date);
      if (!sessionsByDate[dateKey]) {
        sessionsByDate[dateKey] = [];
      }
      sessionsByDate[dateKey].push(session);
    });

    return (
      <div className="space-y-12">
        {Object.entries(sessionsByDate).map(([dateKey, dateSessions]) => (
          <motion.div key={dateKey} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            <div className="relative pl-6 md:pl-8 border-l-2 border-border/40 pb-4">
              {/* Timeline Marker */}
              <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-background border-2 border-primary z-10 shadow-sm" />
              
              <div className="mb-6">
                <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                  {dateKey}
                  {dateKey === formatDate(new Date()) && (
                    <Badge className="bg-primary/20 text-primary border-none text-[10px] uppercase tracking-tighter px-2">Today</Badge>
                  )}
                </h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence>
                  {dateSessions.map((session) => (
                    <SessionCard key={session.id} session={session} />
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Decorative backgrounds */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/4 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/4 pointer-events-none" />

      <div className="max-w-7xl mx-auto p-4 md:p-8 relative z-10">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }} 
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <Badge variant="outline" className="mb-4 py-1 px-4 rounded-full border-primary/20 text-primary font-bold tracking-wide uppercase text-xs bg-primary/5">
            Learning Roadmap
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold font-display text-foreground mb-4">
            Class <span className="gradient-text">Schedule</span>
          </h1>
          <div className="flex items-center justify-center gap-2 text-muted-foreground text-sm font-medium">
            <Clock className="w-4 h-4" />
            <span>Updates every session • Indian Standard Time (IST)</span>
          </div>
        </motion.div>

        {!userCourses || userCourses.length === 0 ? (
          <div className="glass-card rounded-2xl p-12 text-center max-w-2xl mx-auto">
            <AlertCircle className="w-12 h-12 text-primary/40 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-foreground">No Courses Enrolled</h2>
            <p className="text-muted-foreground mt-3 mb-8">
              Enrol in courses to see your personalized class schedule and join live sessions.
            </p>
            <Button asChild className="gradient-bg px-8">
              <a href="/courses">View All Courses</a>
            </Button>
          </div>
        ) : (
          <div className="space-y-16">
            {/* Today's Highlight */}
            <TodayHighlight />

            {/* Upcoming Grid */}
            <section>
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-foreground/70" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-foreground">Upcoming Classes</h2>
                  <p className="text-sm text-muted-foreground">Stay ahead of your learning milestones</p>
                </div>
              </div>
              <ScheduleGrid />
            </section>

            {/* Legend / Info */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="pt-8"
            >
              <Card className="glass-card p-8 border-dashed bg-primary/5">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                  <div>
                    <h3 className="text-xl font-bold text-foreground mb-2">Class Policy & Help</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      All live classes are recorded and available in the course dashboard within 24 hours. 
                      Need help joining? Contact our support team on WhatsApp for immediate assistance.
                    </p>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    <div className="flex items-center gap-2 bg-background/50 p-3 rounded-xl border border-border/20">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-sm shadow-red-500/20" />
                      <span className="text-xs font-bold text-foreground/80">LIVE NOW</span>
                    </div>
                    <div className="flex items-center gap-2 bg-background/50 p-3 rounded-xl border border-border/20">
                      <div className="w-2.5 h-2.5 rounded-full bg-primary shadow-sm shadow-primary/20" />
                      <span className="text-xs font-bold text-foreground/80">UPCOMING</span>
                    </div>
                    <div className="flex items-center gap-2 bg-background/50 p-3 rounded-xl border border-border/20">
                      <div className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-sm shadow-green-500/20" />
                      <span className="text-xs font-bold text-foreground/80">FINISHED</span>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScheduleView;
