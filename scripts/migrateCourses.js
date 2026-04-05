#!/usr/bin/env node

/**
 * Course Migration Script
 *
 * This script migrates all course data from the seedCourses.ts file to Firebase
 * Run this once to populate Firebase with course data
 *
 * Usage: node scripts/migrateCourses.js
 */

const { initializeApp } = require('firebase/app');
const { getFirestore, doc, setDoc } = require('firebase/firestore');
const courses = require('../src/firebase/seedCourses.ts').courses;

const firebaseConfig = {
  apiKey: "AIzaSyDyVX2PrWecJz1HLnFfNRyjkERs2B9YxoU",
  authDomain: "ramini-academy.firebaseapp.com",
  projectId: "ramini-academy",
  storageBucket: "ramini-academy.firebasestorage.app",
  messagingSenderId: "39630488089",
  appId: "1:39630488089:web:18b6e0a6b14c290e17a088"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function migrateCourses() {
  console.log('🚀 Starting course migration to Firebase...');
  console.log(`📚 Migrating ${courses.length} courses`);

  try {
    for (let i = 0; i < courses.length; i++) {
      const course = courses[i];
      console.log(`📝 Migrating course ${i + 1}/${courses.length}: ${course.title}`);

      await setDoc(doc(db, "courses", course.id), course);

      // Add a small delay to avoid overwhelming Firebase
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    console.log('✅ Migration completed successfully!');
    console.log('🎉 All courses are now in Firebase');
    console.log('🔗 You can now manage courses through the /admin page');

  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }

  process.exit(0);
}

migrateCourses();