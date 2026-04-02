import { initializeApp } from 'firebase/app';
import { getFirestore, doc, updateDoc, getDoc } from 'firebase/firestore';

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

async function updateQuestionText() {
  console.log("🚀 UPDATING LIVE QUESTION TEXT...");
  try {
    const pythonRef = doc(db, "courses", "python-zero-hero");
    const snap = await getDoc(pythonRef);
    if (!snap.exists()) return;

    const data = snap.data();
    const questions = data.finalQuiz.questions;
    
    // Find the 9th question
    const q9 = questions[8];
    if (q9 && q9.id === "q9") {
      q9.question = "Write a function `find_max(numbers)` that returns the largest number in a list of integers. (Don't use built-in functions like max())";
      
      await updateDoc(pythonRef, {
        "finalQuiz.questions": questions
      });
      console.log("✅ Successfully updated live question text!");
      console.log("🎉 Refresh your browser to see the change.");
    }
  } catch (error) {
    console.error("❌ Failed:", error);
  }
}

updateQuestionText();
