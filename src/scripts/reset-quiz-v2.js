import { initializeApp } from "firebase/app";
import { getFirestore, query, collection, where, getDocs, updateDoc, doc, deleteDoc } from "firebase/firestore";

// CONFIG FROM src/firebase/config.ts
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

const TARGET_EMAIL = "raminisaisanthosh@gmail.com";
const COURSE_ID = "python-zero-hero";

async function resetQuiz() {
  console.log(`🔍 SEARCHING LIVE PROJECT FOR USER: ${TARGET_EMAIL}...`);
  
  const usersRef = collection(db, "users");
  const q = query(usersRef, where("email", "==", TARGET_EMAIL));
  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    console.error("❌ Error: No user found in the LIVE project.");
    return;
  }

  const userDoc = querySnapshot.docs[0];
  const userRef = doc(db, "users", userDoc.id);
  const userData = userDoc.data();

  console.log(`✅ Found user: ${userDoc.id}. Resetting quiz...`);

  try {
    const currentProgress = userData.progress?.[COURSE_ID] || {};
    await updateDoc(userRef, {
      [`progress.${COURSE_ID}`]: {
        ...currentProgress,
        quizScore: 0,
        completed: false,
        certificateDate: null
      }
    });

    const certsRef = collection(db, "certificates");
    const certQuery = query(certsRef, where("userId", "==", userDoc.id), where("courseId", "==", COURSE_ID));
    const certSnapshot = await getDocs(certQuery);

    for (const certDoc of certSnapshot.docs) {
      await deleteDoc(doc(db, "certificates", certDoc.id));
    }

    console.log("🎉 Success! Quiz reset on LIVE project complete.");
  } catch (error) {
    console.error("❌ Failed:", error);
  }
}

resetQuiz();
