const { initializeApp, cert } = require('firebase-admin/app');
const serviceAccount = require('./serviceAccountKey.json');
const { getFirestore, FieldValue } = require('firebase-admin/firestore');

// TODO: Replace with your Firebase project ID from https://console.firebase.google.com
const projectId = 'ramini-academy';

initializeApp({ credential: cert(serviceAccount) });
const db = getFirestore();

const [,, email, courseId] = process.argv;

if (!email || !courseId) {
  console.log('🚀 ASSIGN COURSE');
  console.log('Usage: node scripts/assignCourse.js "raminisaisanthosh@gmail.com" "python-zero-hero"');
  console.log('Or for ALL: node scripts/assignCourse.js "saip83829@gmail.com" "all"');
  console.log('\\nCourse IDs: python-zero-hero, web-dev-basics, dsa-python, ai-tools, powerpoint, excel');
  process.exit(1);
}

const allCourseIds = ['python-zero-hero', 'web-dev-basics', 'dsa-python', 'ai-tools', 'powerpoint', 'excel'];

async function assignSingle(courseId) {
  console.log(`🔄 Assigning ${courseId} to ${email}...`);
  
  try {
    // Find ALL user docs with this email (same email can have different UIDs if signed in with Google vs Email/Password)
    const snapshot = await db.collection('users').where('email', '==', email).get();
    
    if (snapshot.empty) {
      console.log('❌ User not found:', email);
      console.log('Sign in on the device/app first, then run this script again.');
      return false;
    }
    
    const courseSnap = await db.collection('courses').doc(courseId).get();
    const totalClasses = courseSnap.exists && courseSnap.data()?.totalClasses
      ? courseSnap.data().totalClasses
      : 10;
    
    const progressPayload = {
      completedClasses: 0,
      totalClasses,
      quizScore: 0,
      completed: false,
      isPaid: true,
      certificateDate: null
    };
    
    for (const userDoc of snapshot.docs) {
      await userDoc.ref.update({
        paidCourses: FieldValue.arrayUnion(courseId),
        enrolledCourses: FieldValue.arrayUnion(courseId),
        [`progress.${courseId}`]: progressPayload
      });
      const userData = userDoc.data();
      console.log(`  ✓ Updated UID: ${userDoc.id} (${userData.name || 'N/A'})`);
    }
    
    console.log(`✅ ${courseId} SUCCESS!`);
    console.log(`Updated ${snapshot.size} account(s) for ${email}`);
    return true;
    
  } catch (error) {
    console.error(`❌ Error for ${courseId}:`, error.message);
    return false;
  }
}

async function main() {
  if (courseId === 'all') {
    console.log('🔄 Assigning ALL courses to', email);
    let successCount = 0;
    for (const id of allCourseIds) {
      const success = await assignSingle(id);
      if (success) successCount++;
    }
    console.log(`\\n🎉 ALL DONE! ${successCount}/${allCourseIds.length} courses assigned`);
    console.log('Refresh app on any device — all courses unlocked!');
  } else {
    await assignSingle(courseId);
  }
}

main();
