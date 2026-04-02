import { initializeApp } from "firebase/app";
import { getFirestore, query, collection, where, getDocs, updateDoc, doc } from "firebase/firestore";

// Manual config for the script to avoid import.meta errors in Node
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

const TARGET_EMAIL = "saisanthosh26082007@gmail.com";
const COURSE_ID = "python-zero-hero";

async function updateProgress() {
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

  console.log(`✅ Found user: ${userDoc.id}. Updating ${COURSE_ID} progress to 100%...`);

  try {
    await updateDoc(userRef, {
      [`progress.${COURSE_ID}`]: {
        progress: 100,
        completedClasses: 10,
        lastAccessed: new Date().toISOString()
      },
      paidCourses: Array.from(new Set([...(userDoc.data().paidCourses || []), COURSE_ID]))
    });

    console.log("🎉 Success! Progress updated to 100%. Refresh your browser to see the changes.");
  } catch (error) {
    console.error("❌ Failed to update progress:", error);
  }
}

updateProgress();
