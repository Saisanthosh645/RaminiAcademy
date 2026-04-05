# Course Management System

This system allows you to easily manage all course content, Zoom links, schedules, and enrollment data through a web interface.

## 🚀 Quick Start

### 1. Migrate Courses to Firebase (One-time setup)
```bash
# Run this once to move all course data from code to Firebase
node scripts/migrateCourses.js
```

### 2. Access Admin Panel
- Go to `/admin` in your app
- Login with admin credentials (currently set to `admin@raminiacademy.com`)

### 3. Start Managing Courses
- **Bulk Update Zoom Links**: Update all Zoom links at once
- **Edit Individual Courses**: Click "Edit Course" to modify any course
- **Real-time Updates**: Changes appear immediately in the app

## 📋 Features

### ✅ What You Can Update
- **Zoom Links**: Change meeting links for all classes or individual sessions
- **Course Schedule**: Add, edit, or remove class sessions
- **Class Topics**: Update what each class covers
- **Dates & Times**: Modify when classes happen
- **Course Details**: Title, description, instructor, price, capacity
- **Enrollment Data**: Track how many students are enrolled

### 🎯 Easy Updates
- **No Code Changes**: Update everything through the web interface
- **Bulk Operations**: Change Zoom links for all courses at once
- **Visual Editor**: See and edit course schedules in a table format
- **Auto-save**: Changes are saved to Firebase instantly

## 🔧 How to Use

### Bulk Zoom Link Updates
1. Go to Admin → "Bulk Zoom Links" tab
2. Enter new Zoom links for each course
3. Click "Update All Zoom Links"
4. All courses now have new meeting links

### Edit Individual Courses
1. Go to Admin → "Manage Courses" tab
2. Click "Edit Course" on any course
3. Update any field: schedule, Zoom links, content, etc.
4. Click "Save Changes"

### Add New Classes
1. Edit any course
2. In the Schedule section, click "Add Class"
3. Fill in topic, date, time, and Zoom link
4. Save the course

### Update Class Content
1. Edit a course
2. Modify class topics, dates, times
3. Update Zoom links per session if needed
4. Save changes

## 📊 Analytics Dashboard

The admin panel includes:
- Total number of courses
- Total student enrollments
- Number of active courses
- Course capacity vs enrollment tracking

## 🔒 Security

- Admin access is restricted to specific email addresses
- All data is stored securely in Firebase
- Changes are logged and versioned

## 🆘 Troubleshooting

### Courses not showing in admin?
Run the migration script:
```bash
node scripts/migrateCourses.js
```

### Changes not appearing?
- Refresh the page
- Check browser console for errors
- Verify Firebase connection

### Can't access admin panel?
- Check if your email is in the admin list
- Contact developer to add your email

## 🎉 Benefits

- **Zero Code Changes**: Update courses without touching code
- **Real-time Updates**: Changes appear immediately
- **Bulk Operations**: Update multiple courses at once
- **Visual Interface**: Easy-to-use web interface
- **Data Integrity**: All changes tracked in Firebase
- **Scalable**: Add new courses and features easily

---

**Need help?** Contact the development team or check the Firebase console for data management.