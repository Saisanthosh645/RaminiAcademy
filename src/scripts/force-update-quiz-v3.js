import { initializeApp } from 'firebase/app';
import { getFirestore, doc, updateDoc } from 'firebase/firestore';

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

const finalQuiz = {
  id: "py-quiz-1",
  title: "Python 0 to Hero - Final Exam",
  topic: "Python Fundamentals",
  isFinalExam: true,
  questions: [
    { id: "q1", question: "What is a list in Python?", options: ["Ordered mutable sequence", "Immutable mapping", "Set type", "Tuple"], correctAnswer: 0 },
    { id: "q2", question: "How do you start a for loop?", options: ["for i in range():", "while i < 10", "loop i in range", "iterate i from 0"], correctAnswer: 0 },
    { id: "q3", question: "What does lambda do in Python?", options: ["Creates classes", "Creates anonymous functions", "Loops through data", "Declares variables"], correctAnswer: 1 },
    { id: "q4", question: "How do you handle exceptions in Python?", options: ["throw", "catch", "try/except", "if/else"], correctAnswer: 2 },
    { id: "q5", question: "What is OOP?", options: ["Object Oriented Programming", "Output Operation Programming", "Online Order Processing", "Open Operator Platform"], correctAnswer: 0 },
    { id: "q6", question: "Which keyword is used for importing?", options: ["import", "include", "use", "require"], correctAnswer: 0 },
    { id: "q7", question: "What is the purpose of 'def'?", options: ["Define variables", "Define functions", "Define classes", "Default value"], correctAnswer: 1 },
    { id: "q8", question: "How many data types are in Python?", options: ["3", "4", "5", "More than 5"], correctAnswer: 3 },
    { 
      id: "q9", 
      question: "Write a function `find_max(numbers)` that returns the largest number in a list of integers.", 
      type: "coding",
      options: [], 
      correctAnswer: -1, 
      starterCode: "def find_max(numbers):\n    # Write your logic here\n    pass",
      testCases: [
        { "input": "[1, 5, 2]", "expectedOutput": "5" },
        { "input": "[-10, -5, -20]", "expectedOutput": "-5" },
        { "input": "[42]", "expectedOutput": "42" }
      ]
    }
  ]
};

async function updatePythonQuiz() {
  console.log("🚀 UPDATING THE CORRECT FIRESTORE PROJECT (Ramini Academy)...");
  try {
    const pythonRef = doc(db, "courses", "python-zero-hero");
    await updateDoc(pythonRef, {
      finalQuiz: finalQuiz
    });
    console.log("✅ Successfully added coding question to the LIVE project!");
    console.log("🎉 Please refresh your browser.");
  } catch (error) {
    console.error("❌ Failed to update quiz:", error);
  }
}

updatePythonQuiz();
