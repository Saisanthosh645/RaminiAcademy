# 🎨 Schedule Visual Guide & Demo Data

## 📺 UI Layout Overview

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  Class Schedule                                      🚀      │
│  Your weekly learning journey                              │
│  Current time: March 21, 2026, 3:45:30 PM                 │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  🔔 TODAY'S CLASSES                                        │
│  ─────────────────────────────────────────────────────────│
│                                                             │
│  ┌──────────────────┐  ┌──────────────────┐               │
│  │ Python 0 to Hero │  │ Web Dev Basics   │               │
│  │ Saturday         │  │ Saturday         │               │
│  │ [🔵 Upcoming]    │  │ [🔵 Upcoming]    │               │
│  │                  │  │                  │               │
│  │ 📅 Sat, Apr 16   │  │ 📅 Sat, Apr 16   │               │
│  │ 🕐 7:00-8:15 PM  │  │ 🕐 8:15-9:15 PM  │               │
│  │ 📹 Zoom Link     │  │ 📹 Zoom Link     │               │
│  │                  │  │                  │               │
│  │ [Starts Soon]📋  │  │ [Starts Soon]📋  │               │
│  └──────────────────┘  └──────────────────┘               │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  📅 UPCOMING CLASSES                                       │
│  ─────────────────────────────────────────────────────────│
│                                                             │
│  Saturday, April 16, 2026                                  │
│  ─────────────────────────────────────                     │
│                                                             │
│  ┌──────────────────┐  ┌──────────────────┐               │
│  │ Python 0 to Hero │  │ Web Dev Basics   │               │
│  │ Saturday         │  │ Saturday         │               │
│  │ [🔵 Upcoming]    │  │ [🔵 Upcoming]    │               │
│  │                  │  │                  │               │
│  │ 📅 Sat, Apr 16   │  │ 📅 Sat, Apr 16   │               │
│  │ 🕐 7:00-8:15 PM  │  │ 🕐 8:15-9:15 PM  │               │
│  │ 📹 Zoom Link     │  │ 📹 Zoom Link     │               │
│  │                  │  │                  │               │
│  │ [Starts Soon]📋  │  │ [Starts Soon]📋  │               │
│  └──────────────────┘  └──────────────────┘               │
│                                                             │
│  ┌──────────────────┐                                      │
│  │ AI Tools Mastery │                                      │
│  │ Saturday         │                                      │
│  │ [🔵 Upcoming]    │                                      │
│  │                  │                                      │
│  │ 📅 Sat, Apr 16   │                                      │
│  │ 🕐 9:15-10:00 PM │                                      │
│  │ 📹 Zoom Link     │                                      │
│  │                  │                                      │
│  │ [Starts Soon]📋  │                                      │
│  └──────────────────┘                                      │
│                                                             │
│  Sunday, April 17, 2026                                    │
│  ──────────────────────────                                │
│                                                             │
│  ┌──────────────────┐  ┌──────────────────┐               │
│  │ DSA (Python)     │  │ MS Excel         │               │
│  │ Sunday           │  │ Sunday           │               │
│  │ [🔵 Upcoming]    │  │ [🔵 Upcoming]    │               │
│  │                  │  │                  │               │
│  │ 📅 Sun, Apr 17   │  │ 📅 Sun, Apr 17   │               │
│  │ 🕐 5:00-6:15 PM  │  │ 🕐 6:15-7:15 PM  │               │
│  │ 📹 Zoom Link     │  │ 📹 Zoom Link     │               │
│  │                  │  │                  │               │
│  │ [Starts Soon]📋  │  │ [Starts Soon]📋  │               │
│  └──────────────────┘  └──────────────────┘               │
│                                                             │
│  ┌──────────────────┐                                      │
│  │ MS PowerPoint    │                                      │
│  │ Sunday           │                                      │
│  │ [🔵 Upcoming]    │                                      │
│  │                  │                                      │
│  │ 📅 Sun, Apr 17   │                                      │
│  │ 🕐 7:15-8:15 PM  │                                      │
│  │ 📹 Zoom Link     │                                      │
│  │                  │                                      │
│  │ [Starts Soon]📋  │                                      │
│  └──────────────────┘                                      │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  STATUS LEGEND                                             │
│  ─────────────────────────────────────────────────────────│
│                                                             │
│  🟢 ✅ Completed - Past sessions                           │
│  🔴 🔴 Live Today - Currently happening                    │
│  🔵 🔵 Upcoming - Future sessions                          │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔄 Status Update Examples

### Example 1: Morning View (Before Sessions)
```
Current Time: March 21, 2026, 2:00 PM

Session 1: Python at 7:00 PM
Time until: 5 hours
Status: 🔵 Upcoming
Button: [Starts Soon] 📋

Status Logic:
  2:00 PM < 7:00 PM (start time)
  → 🔵 Upcoming ✓
```

### Example 2: During Live Session
```
Current Time: March 21, 2026, 7:30 PM (Session in progress)

Session 1: Python at 7:00 PM - 8:15 PM
Status: 🔴 Live Today
Button: [Join Now] 📋

Status Logic:
  7:00 PM (start) ≤ 7:30 PM (now) < 8:15 PM (end)
  → 🔴 Live Today ✓
  → "Join Now" button is enabled and RED
```

### Example 3: After Session Ends
```
Current Time: March 21, 2026, 9:00 PM (Session ended)

Session 1: Python at 7:00 PM - 8:15 PM
Status: ✅ Completed
Button: [Completed] 📋

Status Logic:
  9:00 PM (now) ≥ 8:15 PM (end time)
  → ✅ Completed ✓
  → "Completed" button is disabled
```

---

## 📊 Sample Session Data

### Python 0 to Hero Session
```json
{
  "id": "python-zero-hero-0-Saturday",
  "courseName": "Python 0 to Hero",
  "courseId": "python-zero-hero",
  "date": "2026-04-16T00:00:00.000Z",
  "day": "Saturday",
  "startTime": "19:00",
  "endTime": "20:15",
  "zoomLink": "https://zoom.us/j/1234567890",
  "status": "upcoming"
}
```

### HTML/CSS/JS Web Development Session
```json
{
  "id": "web-dev-basics-0-Saturday",
  "courseName": "HTML, CSS, JavaScript",
  "courseId": "web-dev-basics",
  "date": "2026-04-16T00:00:00.000Z",
  "day": "Saturday",
  "startTime": "20:15",
  "endTime": "21:15",
  "zoomLink": "https://zoom.us/j/2345678901",
  "status": "upcoming"
}
```

---

## 🎯 Time Progression Throughout the Day

```
Morning (8:00 AM)
│ 🔵 All sessions: Upcoming
│ Buttons: "Starts Soon"
│
Afternoon (3:00 PM)
│ 🔵 All sessions: Upcoming
│ Buttons: "Starts Soon"
│
5:00 PM (Sunday classes start)
│ 🔴 DSA session: Live Today
│ Buttons: "Join Now" (RED)
│ 🔵 Other sessions: Upcoming
│
7:15 PM (Web Dev finishes)
│ ✅ Session 2: Completed
│ 🔴 Session 3: Live Today
│ 🔵 Future sessions: Upcoming
│
9:15 PM (All sessions done)
│ ✅ All sessions: Completed
│ Buttons: "Completed" (DISABLED)
```

---

## 📱 Responsive Layouts

### Mobile View (< 640px)
```
┌────────────────────┐
│ Today's Classes    │
├────────────────────┤
│ ┌────────────────┐ │
│ │ Python         │ │
│ │ [Upcoming]     │ │
│ │ 7:00-8:15 PM   │ │
│ │ [Join] [Copy]  │ │
│ └────────────────┘ │
│ ┌────────────────┐ │
│ │ Web Dev        │ │
│ │ [Upcoming]     │ │
│ │ 8:15-9:15 PM   │ │
│ │ [Join] [Copy]  │ │
│ └────────────────┘ │
│ ┌────────────────┐ │
│ │ AI Tools       │ │
│ │ [Upcoming]     │ │
│ │ 9:15-10:00 PM  │ │
│ │ [Join] [Copy]  │ │
│ └────────────────┘ │
└────────────────────┘
(1 column)
```

### Tablet View (640px - 1024px)
```
┌──────────────────────────────┐
│ Today's Classes              │
├──────────────────────────────┤
│ ┌────────────┐ ┌────────────┐│
│ │ Python     │ │ Web Dev    ││
│ │[Upcoming]  │ │[Upcoming]  ││
│ │7:00-8:15   │ │8:15-9:15   ││
│ │[J] [C]     │ │[J] [C]     ││
│ └────────────┘ └────────────┘│
│ ┌────────────┐                │
│ │ AI Tools   │                │
│ │[Upcoming]  │                │
│ │9:15-10:00  │                │
│ │[J] [C]     │                │
│ └────────────┘                │
└──────────────────────────────┘
(2 columns)
```

### Desktop View (> 1024px)
```
┌─────────────────────────────────────────┐
│ Today's Classes                         │
├─────────────────────────────────────────┤
│ ┌────────┐ ┌────────┐ ┌────────┐       │
│ │ Python │ │ Web    │ │ AI     │       │
│ │[Live]  │ │Dev     │ │Tools   │       │
│ │7:00-   │ │[Upcom] │ │[Upcom] │       │
│ │[J] [C] │ │[S] [C] │ │[S] [C] │       │
│ └────────┘ └────────┘ └────────┘       │
└─────────────────────────────────────────┘
(3 columns)
```

---

## 🎨 Color & Status Reference

| Status | Icon | Badge Color | Button Color | Button Text |
|--------|------|-------------|--------------|-------------|
| Completed | ✅ | Green (#10b981) | Gray (Disabled) | Completed ✅ |
| Live Today | 🔴 | Red (#ef4444) | Red (#dc2626) | Join Now 🎥 |
| Upcoming | 🔵 | Blue (#3b82f6) | Gray (Disabled) | Starts Soon ⏰ |

---

## 🔔 Animation Sequence

```
Component Load
    ↓
1. Fade in header (0.3s)
    ↓
2. Fade in "Today's Classes" (0.3s delay)
    ↓
3. Cards appear with stagger (0.3s each)
    ↓
4. Fade in legend (0.6s delay)
    ↓
Total: ~1.2 seconds smooth reveal
```

---

## 🔗 Zoom Link Examples

```
Python 0 to Hero
  → https://zoom.us/j/1234567890

HTML, CSS, JavaScript
  → https://zoom.us/j/2345678901

Data Structures & Algorithms
  → https://zoom.us/j/3456789012

AI Tools Mastery
  → https://zoom.us/j/4567890123

MS PowerPoint
  → https://zoom.us/j/5678901234

MS Excel
  → https://zoom.us/j/6789012345
```

---

## 📋 Weekly Schedule Grid

```
TIME      │ SATURDAY         │ SUNDAY
──────────┼──────────────────┼──────────────────
5:00 PM   │                  │ DSA (Python)
          │                  │ 6:15 PM
──────────┼──────────────────┼──────────────────
6:15 PM   │                  │ MS Excel
          │                  │ 7:15 PM
──────────┼──────────────────┼──────────────────
7:00 PM   │ Python 0 to Hero │
7:15 PM   │ 8:15 PM          │ MS PowerPoint
          │                  │ 8:15 PM
──────────┼──────────────────┼──────────────────
8:15 PM   │ Web Dev          │
9:15 PM   │ 9:15 PM          │
          │                  │
──────────┼──────────────────┼──────────────────
9:15 PM   │ AI Tools         │
10:00 PM  │ (ends)           │
```

---

## ✏️ Button State Examples

### Live Session Button
```
┌────────────────────────┐
│ 🎥 Join Now            │  ← RED, clickable
└────────────────────────┘
Action: Opens Zoom link
```

### Upcoming Session Button
```
┌────────────────────────┐
│ ⏰ Starts Soon         │  ← GRAY, disabled
└────────────────────────┘
Action: None
```

### Completed Session Button
```
┌────────────────────────┐
│ ✅ Completed          │  ← GRAY, disabled
└────────────────────────┘
Action: None
```

### Copy Link Button (All States)
```
┌─┐
│📋│  ← Always available
└─┘
Action: Copies Zoom link to clipboard
```

---

## 🎬 Real-Time Update Example

**Scenario:** April 16, 2026

```
6:59 PM
  Status: 🔵 Upcoming
  Button: [Starts Soon]
  Timer: "Starts in 1 minute"

7:00 PM (Live!)
  Status: 🔴 Live Today
  Button: [Join Now] - Now RED & Clickable
  Badge: Animated
  Timer: "In progress"

7:30 PM (Mid-session)
  Status: 🔴 Live Today
  Button: [Join Now] - Still RED & Clickable
  Time: "45 mins remaining"

8:15 PM (Session ends)
  Status: ✅ Completed
  Button: [Completed] - Now GRAY & Disabled
  Icon: Green checkmark

8:16 PM
  Status: ✅ Completed
  Button: [Completed] - GRAY & Disabled
  Stays this way
```

---

## 📊 Component Hierarchy

```
ScheduleView
│
├── Header
│   ├── Title: "Class Schedule"
│   ├── Subtitle: "Your weekly learning journey"
│   └── Current Time Display
│
├── TodayHighlight
│   ├── Section Title: "🔔 Today's Classes"
│   └── SessionCards[] (GridLayout)
│
├── ScheduleGrid
│   └── For each date:
│       ├── DateHeader
│       └── SessionCards[] (GridLayout)
│
└── Legend
    ├── Completed Indicator
    ├── Live Today Indicator
    └── Upcoming Indicator
```

---

## 🎯 Usage Journey

```
User Login
    ↓
Dashboard
    ↓
Click "Schedule" in Sidebar
    ↓
ScheduleView Component Loads
    ↓
Display Today's Classes at Top
    ↓
Show Upcoming Sessions (4 weeks)
    ↓
Auto-refresh every 60 seconds
    ↓
When session goes "Live"
    ↓
User clicks "Join Now"
    ↓
Zoom link opens
    ↓
User joins class
```

---

This visual guide demonstrates the complete UI/UX experience of the dynamic schedule system!
