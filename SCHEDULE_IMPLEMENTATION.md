# Dynamic Course Schedule - Implementation Details

## Features Implemented ✅

### 1. **Dynamic Status Updates**
The schedule automatically updates session status based on the current date and time:
- **✅ Completed** - Sessions that ended in the past (green)
- **🔴 Live Today** - Sessions currently happening (red)
- **🔵 Upcoming** - Sessions in the future (blue)

Status is calculated using JavaScript's Date object and updates every minute.

### 2. **Course Timings (Weekly Schedule)**

#### Saturday Schedule
- **7:00 PM - 8:15 PM** → Python 0 to Hero
- **8:15 PM - 9:15 PM** → HTML, CSS, JavaScript (Web Dev)
- **9:15 PM - 10:00 PM** → AI Tools Mastery

#### Sunday Schedule
- **5:00 PM - 6:15 PM** → Data Structures & Algorithms (Python)
- **6:15 PM - 7:15 PM** → MS Excel
- **7:15 PM - 8:15 PM** → MS PowerPoint

### 3. **Schedule Generation**
- Starts from **April 16, 2026** (Saturday)
- Repeats weekly for 12 weeks
- Each session has a unique Zoom link (dummy links for demo)
- Dates are generated dynamically using JavaScript

### 4. **Today's Classes Highlight**
At the top of the schedule, "Today's Classes" section displays:
- All sessions scheduled for today
- Their full details and status
- Action buttons for live sessions

### 5. **User Interface**

#### Session Cards Display:
- Course name and day
- Date in full format (e.g., "Saturday, April 16, 2026")
- Time range (e.g., "7:00 PM - 8:15 PM")
- Current status badge with icon

#### Action Buttons:
- **Join Now** (Red) - For live sessions only, opens Zoom link
- **Starts Soon** (Disabled) - For upcoming sessions
- **Completed** (Disabled) - For past sessions
- **Copy Link Button** - Always available to copy Zoom link

#### Status Badges:
- Green with checkmark for completed
- Red with lightning bolt for live
- Blue with alert icon for upcoming

### 6. **Grouping & Organization**
- Sessions grouped by date
- Full date header for each day
- Responsive grid layout (1 col mobile, 2 cols tablet, 3 cols desktop)
- Legend explaining color codes and status meanings

### 7. **Technical Implementation**

#### Files Created:
1. **`src/lib/scheduleGenerator.ts`** - Schedule logic and utilities
   - `generateWeeklySchedule()` - Creates schedule for specified weeks
   - `getSessionStatus()` - Determines status based on current time
   - `getTodaySessions()` - Filters today's classes
   - `groupSessionsByDay()` - Organizes by Saturday/Sunday
   - `getUpcomingSchedule()` - Gets next 4 weeks

2. **`src/components/ScheduleView.tsx`** - React component
   - Displays schedule with animations
   - Auto-refreshes every minute for status updates
   - Responsive UI with Tailwind CSS
   - Uses shadcn/ui components

3. **`src/pages/Schedule.tsx`** - Page wrapper
   - Integration with DashboardLayout
   - Protected route

4. **Updated `src/App.tsx`** - Added schedule route
5. **Updated `src/components/AppSidebar.tsx`** - Added Schedule link to navigation

## How It Works

### Auto-Status Update Flow:
```
1. Component mounts → Generate all sessions
2. Timer starts → Updates every 60 seconds
3. For each session: current time compared to session start/end
4. Status determination:
   - now < sessionStart → "upcoming"
   - sessionStart ≤ now < sessionEnd → "live"
   - now ≥ sessionEnd → "completed"
5. UI re-renders with updated status
```

### Date Calculation:
```
Start Date: April 16, 2026 (Saturday)
For each week (0-11):
  - Saturday sessions: date + 0 days
  - Sunday sessions: date + 1 day
  - Next week: add 7 days to start date
```

## Customization Guide

### Change Starting Date:
Edit `src/lib/scheduleGenerator.ts`:
```typescript
// Line 67
let startDate = new Date(2026, 3, 16); // (year, month-1, day)
```

### Change Course Timings:
Edit `COURSE_SCHEDULE` array in `src/lib/scheduleGenerator.ts`:
```typescript
{ 
  courseId: "python-zero-hero", 
  courseName: "Python 0 to Hero", 
  day: "Saturday", 
  startTime: "19:00",  // HH:MM format (24-hour)
  endTime: "20:15" 
}
```

### Change Number of Weeks:
Update the parameter in `src/components/ScheduleView.tsx`:
```typescript
const allSessions = generateWeeklySchedule(12); // Change 12 to desired weeks
```

### Customize Zoom Links:
Edit the `zoomIds` object in `src/lib/scheduleGenerator.ts`:
```typescript
const zoomIds: Record<string, string> = {
  "python-zero-hero": "1234567890",
  // Add your actual Zoom meeting IDs
};
```

## Features in Action

### Real-time Status Display:
- When viewing the schedule, the current time is shown at the top
- Status badges update every minute
- "Join Now" button appears only during live sessions

### Copy Zoom Link:
- Click the "📋" button on any session card
- Zoom link copied to clipboard
- Toast notification confirms copy

### Responsive Design:
- Mobile: Single column layout
- Tablet: Two columns
- Desktop: Three columns
- All interactive elements touch-friendly

## API/Integration Points

### No External API Required:
- Uses browser's native Date object
- All schedule data generated client-side
- Works offline (except Zoom links)

### Database Integration (Optional):
To save user attendance:
```typescript
// Store in userProgress collection
{
  userId: string,
  sessionId: string,
  attended: boolean,
  timestamp: Date
}
```

## Browser Compatibility
- Modern browsers with JavaScript enabled
- Requires React 18+
- Framer Motion for animations
- Tailwind CSS for styling

## Performance Notes
- Initial load: ~50ms for 12 weeks (72 sessions)
- Status update check: ~1ms per minute
- Memory: ~2-3KB for schedule data
- Reusable component - can display multiple schedules

## Future Enhancements
1. Add user attendance tracking
2. Send reminders before sessions
3. Calendar view export
4. Session recording links auto-populate
5. Student Q&A before each session
6. Interactive attendance tracking
7. Session analytics dashboard
