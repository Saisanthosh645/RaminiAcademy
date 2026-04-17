// Schedule Generator - Creates dynamic weekly schedule from the first Saturday in the series

export interface ScheduleSession {
  id: string;
  courseName: string;
  courseId: string;
  date: Date;
  day: "Saturday" | "Sunday";
  startTime: string; // HH:MM format
  endTime: string;
  zoomLink: string;
  status: "completed" | "live" | "upcoming";
}

const COURSE_SCHEDULE = [
  // Saturday Schedule
  { courseId: "powerpoint", courseName: "MS PowerPoint", day: "Saturday" as const, startTime: "19:00", endTime: "20:15" },
  { courseId: "web-dev-basics", courseName: "HTML, CSS, JavaScript", day: "Saturday" as const, startTime: "20:15", endTime: "21:15" },
  { courseId: "ai-tools", courseName: "AI Tools Mastery", day: "Saturday" as const, startTime: "21:15", endTime: "22:00" },
  
  // Sunday Schedule
  { courseId: "dsa-python", courseName: "Data Structures & Algorithms", day: "Sunday" as const, startTime: "17:00", endTime: "18:15" },
  { courseId: "excel", courseName: "MS Excel", day: "Sunday" as const, startTime: "18:15", endTime: "19:15" },
  { courseId: "python-zero-hero", courseName: "Python 0 to Hero", day: "Sunday" as const, startTime: "19:15", endTime: "20:15" },
];

// Generate dummy Zoom links
const generateZoomLink = (courseId: string, index: number): string => {
  const zoomIds: Record<string, string> = {
    "python-zero-hero": "1234567890",
    "web-dev-basics": "2345678901",
    "dsa-python": "3456789012",
    "ai-tools": "4567890123",
    "powerpoint": "5678901234",
    "excel": "6789012345",
  };
  return `https://zoom.us/j/${zoomIds[courseId] || "1234567890"}`;
};

// Get the day of week for a given date
const getDayOfWeek = (date: Date): string => {
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  return days[date.getDay()];
};

// Determine session status based on current date and time
const getSessionStatus = (sessionDate: Date, startTime: string, endTime: string): "completed" | "live" | "upcoming" => {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const sessionStart = new Date(sessionDate.getFullYear(), sessionDate.getMonth(), sessionDate.getDate());

  // Parse times
  const [startHour, startMin] = startTime.split(":").map(Number);
  const [endHour, endMin] = endTime.split(":").map(Number);
  
  const sessionStartTime = new Date(sessionStart);
  sessionStartTime.setHours(startHour, startMin, 0);
  
  const sessionEndTime = new Date(sessionStart);
  sessionEndTime.setHours(endHour, endMin, 0);

  // Compare
  if (now < sessionStartTime) {
    return "upcoming";
  } else if (now >= sessionStartTime && now < sessionEndTime) {
    return "live";
  } else {
    return "completed";
  }
};

// Generate schedule starting from April 18, 2026 (Saturday) for multiple weeks
import { Course } from '@/types/firebase';

export const generateWeeklySchedule = (weeksCount: number = 12): ScheduleSession[] => {
  return generateUserSchedule([], weeksCount); // Empty = all courses
};

export const generateUserSchedule = (userCourses: Course[], weeksCount: number = 12): ScheduleSession[] => {
  const sessions: ScheduleSession[] = [];
  const startDate = new Date(2026, 3, 18); // April 18, 2026 (Saturday)
  
  // Filter COURSE_SCHEDULE to only user's courses
  const userCourseIds = userCourses.map(c => c.id);
  const userSchedule = COURSE_SCHEDULE.filter(s => userCourseIds.includes(s.courseId));
  
  for (let week = 0; week < weeksCount; week++) {
    // For each user's course schedule type
    for (const schedule of userSchedule) {
      // Calculate the actual date based on day
      const dayOffset = schedule.day === "Saturday" ? 0 : 1;
      const sessionDate = new Date(startDate);
      sessionDate.setDate(sessionDate.getDate() + dayOffset);

      // Generate unique ID
      const sessionId = `${schedule.courseId}-${week}-${schedule.day}`;

      // Determine status
      const status = getSessionStatus(sessionDate, schedule.startTime, schedule.endTime);

      sessions.push({
        id: sessionId,
        courseName: schedule.courseName,
        courseId: schedule.courseId,
        date: sessionDate,
        day: schedule.day,
        startTime: schedule.startTime,
        endTime: schedule.endTime,
        zoomLink: generateZoomLink(schedule.courseId, week),
        status,
      });
    }

    // Move to next Saturday
    startDate.setDate(startDate.getDate() + 7);
  }

  return sessions;
};

// Get today's sessions
export const getTodaySessions = (sessions: ScheduleSession[]): ScheduleSession[] => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  return sessions.filter((session) => {
    const sessionDate = new Date(session.date.getFullYear(), session.date.getMonth(), session.date.getDate());
    return sessionDate.getTime() === today.getTime();
  });
};

// Group sessions by day
export const groupSessionsByDay = (sessions: ScheduleSession[]): Record<string, ScheduleSession[]> => {
  const grouped: Record<string, ScheduleSession[]> = {
    Saturday: [],
    Sunday: [],
  };

  sessions.forEach((session) => {
    if (session.day === "Saturday") {
      grouped.Saturday.push(session);
    } else {
      grouped.Sunday.push(session);
    }
  });

  return grouped;
};

// Get next 4 weeks of sessions
export const getUpcomingSchedule = (sessions: ScheduleSession[]): ScheduleSession[] => {
  const now = new Date();
  const fourWeeksLater = new Date(now.getTime() + 28 * 24 * 60 * 60 * 1000);

  return sessions
    .filter((session) => session.date <= fourWeeksLater)
    .sort((a, b) => a.date.getTime() - b.date.getTime());
};
