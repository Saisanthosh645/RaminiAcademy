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
        return "bg-green-100 text-green-800 border-green-300";
      case "live":
        return "bg-red-100 text-red-800 border-red-300";
      case "upcoming":
        return "bg-blue-100 text-blue-800 border-blue-300";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="w-4 h-4" />;
      case "live":
        return <Zap className="w-4 h-4" />;
      case "upcoming":
        return <AlertCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getStatusLabel = (status: string): string => {
    switch (status) {
      case "completed":
        return "✅ Completed";
      case "live":
        return "🔴 Live Today";
      case "upcoming":
        return "🔵 Upcoming";
      default:
        return status;
    }
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric",
      year: "numeric",
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
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="relative"
    >
      <Card className={`overflow-hidden border-l-4 ${
        session.status === "live" ? "border-l-red-500 bg-red-50" : 
        session.status === "completed" ? "border-l-green-500 bg-green-50" : 
        "border-l-blue-500 bg-blue-50"
      }`}>
        <div className="p-4 md:p-5 space-y-3">
          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <h3 className="font-semibold text-foreground text-lg">{session.courseName}</h3>
              <p className="text-xs text-muted-foreground mt-1">{session.day}</p>
            </div>
            <Badge className={`${getStatusColor(session.status)} flex items-center gap-1 whitespace-nowrap`}>
              {getStatusIcon(session.status)}
              {getStatusLabel(session.status)}
            </Badge>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-3">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span className="text-foreground">{formatDate(session.date)}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span className="text-foreground">
                {formatTime(session.startTime)} - {formatTime(session.endTime)}
              </span>
            </div>
            <div className="col-span-2 md:col-span-1 flex items-center gap-2 text-sm">
              <Video className="w-4 h-4 text-muted-foreground" />
              <span className="text-blue-600 font-medium">Zoom Link</span>
            </div>
          </div>

          {/* Action Button */}
          <div className="flex gap-2 pt-2">
            {session.status === "live" ? (
              <Button
                className="flex-1 bg-red-500 hover:bg-red-600 text-white"
                onClick={() => window.open(session.zoomLink, "_blank")}
              >
                <Video className="w-4 h-4 mr-2" />
                Join Now
              </Button>
            ) : session.status === "upcoming" ? (
              <Button variant="secondary" className="flex-1" disabled>
                Starts Soon
              </Button>
            ) : (
              <Button variant="secondary" className="flex-1" disabled>
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Completed
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigator.clipboard.writeText(session.zoomLink)}
              title="Copy Zoom Link"
            >
              📋
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );

  const TodayHighlight = () => {
    if (todaySessions.length === 0) {
      return null;
    }

    return (
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle className="w-5 h-5 text-yellow-600" />
            <h2 className="text-2xl font-bold text-foreground">Today's Classes</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence>
              {todaySessions.map((session) => (
                <SessionCard key={session.id} session={session} />
              ))}
            </AnimatePresence>
          </div>
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
      <div className="space-y-8">
        {Object.entries(sessionsByDate).map(([dateKey, dateSessions]) => (
          <motion.div key={dateKey} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="w-5 h-5 text-primary" />
                <h3 className="text-xl font-bold text-foreground">{dateKey}</h3>
              </div>
              
              {/* Separate by day of week */}
              {dateSessions.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <AnimatePresence>
                    {dateSessions.map((session) => (
                      <SessionCard key={session.id} session={session} />
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold font-display text-foreground">Class Schedule</h1>
            <p className="text-muted-foreground mt-2">Your weekly learning journey</p>
            <p className="text-xs text-muted-foreground mt-1">Current time: {currentTime.toLocaleString()}</p>
          </div>
        </motion.div>

        {/* Today's Highlight */}
        <TodayHighlight />

        {/* Schedule Grid */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-6">Upcoming Classes</h2>
            <ScheduleGrid />
          </div>
        </motion.div>

        {/* Legend */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 20 }} transition={{ delay: 0.4 }}>
          <Card className="p-6 bg-white border border-slate-200">
            <h3 className="font-semibold text-foreground mb-4">Status Legend</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-sm text-foreground">✅ Completed - Past sessions</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span className="text-sm text-foreground">🔴 Live Today - Currently happening</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span className="text-sm text-foreground">🔵 Upcoming - Future sessions</span>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default ScheduleView;
