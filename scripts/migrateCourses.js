#!/usr/bin/env node
/**
 * Migrate courses to Firebase Firestore using Admin SDK
 * Usage: cd scripts && node migrateCourses.js
 * Requires: serviceAccountKey.json, firebase-admin installed in scripts/
 */

const admin = require('firebase-admin');

const serviceAccount = require('./serviceAccountKey.json');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();

const pythonSchedule = [
  { id: 'py-1', topic: 'Python Setup & Basics', date: '2026-04-19', time: '7:15 PM', status: 'upcoming', meetLink: 'https://zoom.us/j/1234567890' },
  { id: 'py-2', topic: 'Data Types & Variables', date: '2026-04-26', time: '7:15 PM', status: 'upcoming', meetLink: 'https://zoom.us/j/1234567890' },
  { id: 'py-3', topic: 'Lists, Tuples, Sets & Dictionaries', date: '2026-05-03', time: '7:15 PM', status: 'upcoming', meetLink: 'https://zoom.us/j/1234567890' },
  { id: 'py-4', topic: 'Conditional Statements (if-else)', date: '2026-05-10', time: '7:15 PM', status: 'upcoming', meetLink: 'https://zoom.us/j/1234567890' },
  { id: 'py-5', topic: 'Loops (for & while)', date: '2026-05-17', time: '7:15 PM', status: 'upcoming', meetLink: 'https://zoom.us/j/1234567890' },
  { id: 'py-6', topic: 'Functions in Python', date: '2026-05-24', time: '7:15 PM', status: 'upcoming', meetLink: 'https://zoom.us/j/1234567890' },
  { id: 'py-7', topic: 'Modules & File Handling', date: '2026-05-31', time: '7:15 PM', status: 'upcoming', meetLink: 'https://zoom.us/j/1234567890' },
  { id: 'py-8', topic: 'Error Handling & Debugging', date: '2026-06-07', time: '7:15 PM', status: 'upcoming', meetLink: 'https://zoom.us/j/1234567890' },
  { id: 'py-9', topic: 'Intro to OOP (Classes & Objects) ⭐', date: '2026-06-14', time: '7:15 PM', status: 'upcoming', meetLink: 'https://zoom.us/j/1234567890' },
  { id: 'py-10', topic: 'Final Project & Revision', date: '2026-06-21', time: '7:15 PM', status: 'upcoming', meetLink: 'https://zoom.us/j/1234567890' }
];

const powerpointSchedule = [
  { id: 'ppt-1', topic: 'Presentation Basics', date: '2026-04-18', time: '7:00 PM', status: 'upcoming', meetLink: 'https://zoom.us/j/5678901234' },
  { id: 'ppt-2', topic: 'Advanced Animations', date: '2026-04-25', time: '7:00 PM', status: 'upcoming', meetLink: 'https://zoom.us/j/5678901234' },
  { id: 'ppt-3', topic: 'Templates & Branding', date: '2026-05-02', time: '7:00 PM', status: 'upcoming', meetLink: 'https://zoom.us/j/5678901234' },
  { id: 'ppt-4', topic: 'Data Visualizations', date: '2026-05-09', time: '7:00 PM', status: 'upcoming', meetLink: 'https://zoom.us/j/5678901234' },
  { id: 'ppt-5', topic: 'Final Presentation', date: '2026-05-16', time: '7:00 PM', status: 'upcoming', meetLink: 'https://zoom.us/j/5678901234' }
];

async function migrateCourses() {
  console.log('🚀 Starting weekend schedule migration to Firestore...');
  
  try {
    const pythonCourseId = 'python-zero-hero';
    const powerpointCourseId = 'powerpoint';

    console.log(`📚 Updating ${pythonCourseId} schedule (Saturday -> Sunday)...`);
    await db.collection('courses').doc(pythonCourseId).set({ schedule: pythonSchedule }, { merge: true });

    console.log(`📚 Interchanging ${powerpointCourseId} slot to keep timetable collision-free...`);
    await db.collection('courses').doc(powerpointCourseId).set({ schedule: powerpointSchedule }, { merge: true });
    
    console.log('✅ Migration complete! Weekend schedules synced.');
    console.log('🔄 Refresh Admin dashboard -> Courses tab to verify.');
    console.log('📱 Public site Dashboard/Courses will now match.');
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  }
}

migrateCourses();
