const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function inspectUsers() {
  const usersRef = db.collection("users");
  const snapshot = await usersRef.get();
  
  let paidCoursesCount = 0;
  let enrolledCoursesCount = 0;
  let adminCount = 0;
  let samplePaidUsers = [];

  snapshot.forEach(doc => {
    const data = doc.data();
    const paidCourses = data.paidCourses || [];
    const enrolledCourses = data.enrolledCourses || [];
    const role = data.role;

    if (paidCourses.length > 0) {
      paidCoursesCount++;
      samplePaidUsers.push({
        uid: doc.id,
        paidCoursesLength: paidCourses.length,
        enrolledCoursesLength: enrolledCourses.length
      });
    }

    if (enrolledCourses.length > 0) {
      enrolledCoursesCount++;
    }

    if (role === "admin") {
      adminCount++;
    }
  });

  console.log("Results:");
  console.log(`1) Users with non-empty paidCourses: ${paidCoursesCount}`);
  console.log(`2) Users with non-empty enrolledCourses: ${enrolledCoursesCount}`);
  console.log(`3) Users with role=admin: ${adminCount}`);
  console.log("4) Sample docs for users with paidCourses > 0:");
  console.log(JSON.stringify(samplePaidUsers, null, 2));
  
  process.exit(0);
}

inspectUsers().catch(err => {
  console.error(err);
  process.exit(1);
});
