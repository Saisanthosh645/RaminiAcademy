import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDyVX2PrWecJz1HLnFfNRyjkERs2B9YxoU",
  authDomain: "ramini-academy.firebaseapp.com",
  projectId: "ramini-academy",
  storageBucket: "ramini-academy.firebasestorage.app",
  messagingSenderId: "348271166318",
  appId: "1:348271166318:web:0420b9e830fb9254d36ef2"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function checkData() {
  const pythonRef = doc(db, "courses", "python-zero-hero");
  const snap = await getDoc(pythonRef);
  if (snap.exists()) {
    const data = snap.data();
    const q9 = data.finalQuiz.questions[8];
    console.log("Q9 Data:", JSON.stringify(q9, null, 2));
  } else {
    console.log("Course not found!");
  }
}

checkData();
