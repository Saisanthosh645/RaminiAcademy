import { initializeApp } from "firebase/app";
import { getFirestore, query, collection, where, getDocs, updateDoc, doc, deleteDoc } from "firebase/firestore";

// Config from update-tester-progress.ts
const firebaseConfig = {
  apiKey: "AIzaSyDyVX2PrWecJz1HLnFfNRyjkERs2B9YxoU",
  authDomain: "ramini-academy.firebaseapp.com",
  projectId: "ramini-academy",
  storageBucket: "ramini-academy.appspot.com",
  messagingSenderId: "348271166318",
  appId: "1:348271166318:web:0420b9e830fb9254d36ef2"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const TARGET_EMAIL = "raminisaisanthosh@gmail.com";
const COURSE_ID = "python-zero-hero";

async function resetQuiz() {
  console.log(`🔍 Searching for user with email: ${TARGET_EMAIL}...`);
  
  const usersRef = collection(db, "users");
  const q = query(usersRef, where("email", "==", TARGET_EMAIL));
  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    console.error("❌ Error: No user found with that email address.");
    return;
  }

  const userDoc = querySnapshot.docs[0];
  const userRef = doc(db, "users", userDoc.id);
  const userData = userDoc.data();

  console.log(`✅ Found user: ${userDoc.id}. Resetting ${COURSE_ID} quiz progress...`);

  try {
    // 1. Reset progress in user document
    const currentProgress = userData.progress?.[COURSE_ID] || {};
    await updateDoc(userRef, {
      [`progress.${COURSE_ID}`]: {
        ...currentProgress,
        quizScore: 0,
        completed: false,
        certificateDate: null
      }
    });
    console.log("✅ User progress reset (Score: 0, Completed: false).");

    // 2. Delete existing certificate
    const certsRef = collection(db, "certificates");
    const certQuery = query(certsRef, where("userId", "==", userDoc.id), where("courseId", "==", COURSE_ID));
    const certSnapshot = await getDocs(certQuery);

    if (!certSnapshot.empty) {
      for (const certDoc of certSnapshot.docs) {
        await deleteDoc(doc(db, "certificates", certDoc.id));
        console.log(`✅ Deleted certificate: ${certDoc.id}`);
      }
    } else {
      console.log("ℹ️ No certificate found to delete.");
    }

    console.log("🎉 Success! Quiz reset complete. Refresh your browser to test again.");
  } catch (error) {
    console.error("❌ Failed to reset quiz:", error);
  }
}

resetQuiz();
