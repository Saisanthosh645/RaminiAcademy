/**
 * Firebase Functions: Certificate Verification Logic
 * 
 * To deploy:
 * 1. Run `firebase init functions` (select TypeScript or JS)
 * 2. Copy this code into `functions/src/index.ts`
 * 3. Run `firebase deploy --only functions`
 */

import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();
const db = admin.firestore();

/**
 * Highly secure certificate generation.
 * This should be used instead of client-side `addDoc` to `certificates`.
 */
export const generateCertificate = functions.https.onCall(async (data, context) => {
  // 1. Ensure user is authenticated
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be logged in.');
  }

  const { courseId } = data;
  const uid = context.auth.uid;

  // 2. Fetch user data and course data
  const userDoc = await db.collection('users').doc(uid).get();
  const userData = userDoc.data();
  const courseDoc = await db.collection('courses').doc(courseId).get();
  const courseData = courseDoc.data();

  if (!userData || !courseData) {
    throw new functions.https.HttpsError('not-found', 'User or Course not found.');
  }

  // 3. Verify pass status (all classes + score >= 60)
  const progress = userData.progress?.[courseId];
  if (!progress || !progress.completed || progress.quizScore < 60) {
    throw new functions.https.HttpsError('failed-precondition', 'Course not completed or exam not passed.');
  }

  // 4. Check if certificate already exists
  const existingCerts = await db.collection('certificates')
    .where('userId', '==', uid)
    .where('courseId', '==', courseId)
    .get();

  if (!existingCerts.empty) {
    return { certificateId: existingCerts.docs[0].data().id };
  }

  // 5. Generate secure ID
  const randomHex = Math.random().toString(36).substring(2, 8).toUpperCase();
  const courseCode = courseId.substring(0, 4).toUpperCase();
  const certificateId = `RAMINI-${courseCode}-${randomHex}`;

  // 6. Store in Firestore
  const certData = {
    id: certificateId,
    userId: uid,
    userName: userData.name,
    courseId: courseId,
    courseName: courseData.title,
    score: progress.quizScore,
    dateOfIssue: new Date().toISOString(),
    verificationUrl: `https://ramini-academy.web.app/verify/${certificateId}`, // Replace with real domain
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  };

  await db.collection('certificates').doc(certificateId).set(certData);

  return { certificateId };
});
