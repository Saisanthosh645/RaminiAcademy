/**
 * Schedule Generator - Example Output & Testing
 * 
 * This file demonstrates how the schedule generator works
 * and what the output looks like
 */

import {
  generateWeeklySchedule,
  getTodaySessions,
  groupSessionsByDay,
  getUpcomingSchedule,
} from "@/lib/scheduleGenerator";

// ============================================
// EXAMPLE: Generate a 2-week schedule
// ============================================
const exampleSchedule = generateWeeklySchedule(2);

console.log("📅 GENERATED SCHEDULE (2 weeks):");
console.log("Total sessions:", exampleSchedule.length); // 12 sessions (6 per week)
console.log(exampleSchedule);

/* Output Example:
[
  {
    id: "python-zero-hero-0-Saturday",
    courseName: "Python 0 to Hero",
    courseId: "python-zero-hero",
    date: Date(2026-04-18T00:00:00),
    day: "Saturday",
    startTime: "19:00",
    endTime: "20:15",
    zoomLink: "https://live.zoho.in/ktas-ldl-rtg",
    status: "upcoming" // Changes based on current date/time
  },
  // ... more sessions
]
*/

// ============================================
// EXAMPLE: Get Today's Sessions
// ============================================
const todaysSessions = getTodaySessions(exampleSchedule);

console.log("📍 TODAY'S SESSIONS:");
console.log(`Found ${todaysSessions.length} sessions today`);
todaysSessions.forEach((session) => {
  console.log(
    `- ${session.courseName} at ${session.startTime} (Status: ${session.status})`
  );
});

/* Output Example (if today is April 18, 2026):
📍 TODAY'S SESSIONS:
Found 3 sessions today
- Python 0 to Hero at 19:00 (Status: upcoming)
- HTML, CSS, JavaScript at 20:15 (Status: upcoming)
- AI Tools Mastery at 21:15 (Status: upcoming)
*/

// ============================================
// EXAMPLE: Group Sessions by Day
// ============================================
const groupedByDay = groupSessionsByDay(exampleSchedule);

console.log("📊 SESSIONS GROUPED BY DAY:");
console.log("Saturday sessions:", groupedByDay.Saturday.length);
console.log("Sunday sessions:", groupedByDay.Sunday.length);

/* Output:
📊 SESSIONS GROUPED BY DAY:
Saturday sessions: 6
Sunday sessions: 6
*/

// ============================================
// EXAMPLE: Get Upcoming Sessions (4 weeks)
// ============================================
const upcomingSessions = getUpcomingSchedule(exampleSchedule);

console.log("⏭️  UPCOMING SESSIONS (4 weeks from now):");
upcomingSessions.forEach((session) => {
  const dateStr = session.date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });
  console.log(
    `${dateStr} | ${session.courseName} at ${session.startTime}`
  );
});

/* Output Example:
⏭️  UPCOMING SESSIONS:
Saturday, Apr 18 | Python 0 to Hero at 19:00
Saturday, Apr 18 | HTML, CSS, JavaScript at 20:15
Saturday, Apr 18 | AI Tools Mastery at 21:15
Sunday, Apr 19 | Data Structures & Algorithms at 17:00
Sunday, Apr 19 | MS Excel at 18:15
Sunday, Apr 19 | MS PowerPoint at 19:15
...
*/

// ============================================
// EXAMPLE: Check Status Changes
// ============================================
console.log("🔄 STATUS UPDATE EXAMPLE:");
console.log("Current time:", new Date().toLocaleTimeString());

const session = exampleSchedule[0];
console.log(`
Session: ${session.courseName}
Date: ${session.date.toLocaleDateString()}
Scheduled: ${session.startTime} - ${session.endTime}
Zoom Link: ${session.zoomLink}
Current Status: ${session.status}

How status is determined:
- If current time < start time → "🔵 Upcoming"
- If current time between start & end → "🔴 Live Today"
- If current time > end time → "✅ Completed"

The status updates EVERY MINUTE automatically!
`);

// ============================================
// EXAMPLE: Time Formatting
// ============================================
console.log("⏰ TIME FORMATTING:");
const formatTime = (time: string): string => {
  const [hours, mins] = time.split(":").map(Number);
  const ampm = hours >= 12 ? "PM" : "AM";
  const displayHours = hours % 12 || 12;
  return `${String(displayHours).padStart(2, "0")}:${String(mins).padStart(2, "0")} ${ampm}`;
};

console.log("19:00 →", formatTime("19:00")); // 07:00 PM
console.log("17:00 →", formatTime("17:00")); // 05:00 PM
console.log("07:00 →", formatTime("07:00")); // 07:00 AM

/* Output:
⏰ TIME FORMATTING:
19:00 → 07:00 PM
17:00 → 05:00 PM
07:00 → 07:00 AM
*/

// ============================================
// EXAMPLE: Zoom Link Generation
// ============================================
console.log("🔗 ZOOM LINKS:");
const courses = [
  "python-zero-hero",
  "web-dev-basics",
  "dsa-python",
  "ai-tools",
  "powerpoint",
  "excel",
];

courses.forEach((courseId) => {
  const zoomId = {
    "python-zero-hero": "ktas-ldl-rtg",
    "web-dev-basics": "2345678901",
    "dsa-python": "3456789012",
    "ai-tools": "4567890123",
    "powerpoint": "5678901234",
    "excel": "6789012345",
  }[courseId];

  console.log(
    `${courseId}: https://zoom.us/j/${zoomId}`
  );
});

/* Output:
🔗 ZOOM LINKS:
python-zero-hero: https://live.zoho.in/ktas-ldl-rtg
web-dev-basics: https://zoom.us/j/2345678901
dsa-python: https://zoom.us/j/3456789012
ai-tools: https://zoom.us/j/4567890123
powerpoint: https://zoom.us/j/5678901234
excel: https://zoom.us/j/6789012345
*/

// ============================================
// EXAMPLE: Weekly Schedule Pattern
// ============================================
console.log("📋 WEEKLY SCHEDULE PATTERN:");
console.log(`
EVERY SATURDAY:
  7:00 PM - 8:15 PM → Python 0 to Hero
  8:15 PM - 9:15 PM → HTML, CSS, JavaScript
  9:15 PM - 10:00 PM → AI Tools Mastery

EVERY SUNDAY:
  5:00 PM - 6:15 PM → Data Structures & Algorithms
  6:15 PM - 7:15 PM → MS Excel
  7:15 PM - 8:15 PM → MS PowerPoint

Starting: April 18, 2026 (Saturday)
Duration: 12 weeks
Total Sessions: 72
`);

// ============================================
// EXAMPLE: Real-time Status Updates
// ============================================
console.log("🔄 REAL-TIME UPDATE SIMULATION:");
console.log(`
The schedule component updates every 60 seconds.

Timeline:
- Minute 0:59 → Status: 🔵 Upcoming
- Minute 1:00 → Status: 🔴 Live Today (Button changes to red "Join Now")
- Minute 2:15 → Status: ✅ Completed (Button disabled)

Example for session at 19:00 (7:00 PM):
- 18:59 PM → 🔵 Upcoming (starts in 1 minute)
- 19:00 PM → 🔴 Live Today (just started)
- 19:08 PM → 🔴 Live Today (still going)
- 20:16 PM → ✅ Completed (ended)
`);

// ============================================
// INTEGRATION EXAMPLE
// ============================================
console.log("💻 REACT COMPONENT USAGE:");
console.log(`
In ScheduleView.tsx:

const [sessions, setSessions] = useState<ScheduleSession[]>([]);

useEffect(() => {
  // Generate schedule on component mount
  const allSessions = generateWeeklySchedule(12);
  setSessions(allSessions);
}, []);

// Get today's sessions
const todaysSessions = getTodaySessions(sessions);

// Get grouped sessions
const grouped = groupSessionsByDay(sessions);

// Auto-update timer
useEffect(() => {
  const timer = setInterval(() => {
    // Triggers re-render, status badges update automatically
    setCurrentTime(new Date());
  }, 60000); // Every minute
  
  return () => clearInterval(timer);
}, []);

// Render sessions...
`);

export { exampleSchedule, todaysSessions, groupedByDay, upcomingSessions };
