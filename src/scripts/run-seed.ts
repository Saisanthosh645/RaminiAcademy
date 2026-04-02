import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { courses } from "../firebase/seedCourses";

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

async function runSeed() {
  console.log("🚀 Starting database seed...");
  
  // We only want to update the python course for now to avoid overwriting other potential changes
  const pythonCourse = courses.find(c => c.id === "python-zero-hero");
  
  if (!pythonCourse) {
    console.error("❌ Python course not found in seed data!");
    return;
  }

  try {
    await setDoc(doc(db, "courses", "python-zero-hero"), pythonCourse, { merge: true });
    console.log("✅ Python course updated with coding question!");
    console.log("🎉 Success! Please refresh your browser.");
  } catch (error) {
    console.error("❌ Seeding failed:", error);
  }
}

runSeed();
