import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
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

const courses = [
  {
    id: 'python-zero-hero',
    title: 'Python 0 to Hero',
    description: 'Complete Python journey from beginner to advanced. Variables, functions, OOP, web scraping, automation.',
    instructor: 'Ramini Academy',
    duration: '8 weeks',
    level: 'Beginner',
    thumbnail: '/placeholder.svg',
    category: 'Beginner',
    totalClasses: 24,
    completedClasses: 0,
    progress: 0,
    schedule: [
      { id: '1', topic: 'Python Basics', date: '2024-10-01', time: '7PM', status: 'upcoming', zoomLink: 'https://zoom.us/j/123', recording: '' },
      { id: '2', topic: 'Functions & Loops', date: '2024-10-03', time: '7PM', status: 'upcoming', zoomLink: 'https://zoom.us/j/123', recording: '' },
      { id: '3', topic: 'Lists & Dicts', date: '2024-10-05', time: '7PM', status: 'upcoming', zoomLink: 'https://zoom.us/j/123', recording: '' },
      { id: '4', topic: 'File Handling', date: '2024-10-08', time: '7PM', status: 'live', zoomLink: 'https://zoom.us/j/123', recording: 'https://recording1' },
      { id: '5', topic: 'OOP Concepts', date: '2024-10-10', time: '7PM', status: 'completed', zoomLink: '', recording: 'https://recording2' },
    ],
    notes: [
      { id: 'n1', title: 'Python Setup Guide', fileUrl: 'https://example.com/python-setup.pdf' },
      { id: 'n2', title: 'Syntax Cheat Sheet', fileUrl: 'https://example.com/cheatsheet.pdf' },
    ],
    announcements: [],
    quizzes: [
      {
        id: 'q1',
        title: 'Python Basics Quiz',
        topic: 'Basics',
        questions: [
          { id: '1', question: 'What is print()', options: ['Function', 'Variable', 'Class', 'Method'], correctAnswer: 0 },
          { id: '2', question: 'String type?', options: ['int', 'str', 'float', 'bool'], correctAnswer: 1 },
        ],
        isFinalExam: false,
      },
    ],
  },
  // Add other 5 courses similarly...
  {
    id: 'web-dev-basics',
    title: 'HTML, CSS, JavaScript (Basic Web Development)',
    description: 'Build modern websites with HTML5, CSS3 Flex/Grid, JavaScript ES6+.',
    instructor: 'Ramini Academy',
    duration: '6 weeks',
    level: 'Beginner',
    thumbnail: '/placeholder.svg',
    category: 'Beginner',
    totalClasses: 18,
    completedClasses: 0,
    progress: 0,
    schedule: [
      { id: '1', topic: 'HTML Fundamentals', date: '2024-10-02', time: '8PM', status: 'upcoming', zoomLink: 'https://zoom.us/j/123', recording: '' },
      // 4 more...
    ],
    notes: [
      { id: 'n1', title: 'HTML Reference', fileUrl: 'https://example.com/html.pdf' },
    ],
    announcements: [],
    quizzes: [
      {
        id: 'q1',
        title: 'HTML Quiz',
        topic: 'HTML',
        questions: [
          { id: '1', question: 'HTML tag?', options: ['div', '<div>', 'Div', 'DIV'], correctAnswer: 0 },
        ],
        isFinalExam: false,
      },
    ],
  },
  {
    id: 'dsa-python',
    title: 'Data Structures & Algorithms (Python)',
    description: 'Arrays, LinkedLists, Trees, Graphs, Sorting, Searching, DP, Big-O.',
    instructor: 'Ramini Academy',
    duration: '10 weeks',
    level: 'Intermediate',
    thumbnail: '/placeholder.svg',
    category: 'Intermediate',
    totalClasses: 30,
    completedClasses: 0,
    progress: 0,
    schedule: [
      // 5 sample
      { id: '1', topic: 'Arrays', date: '2024-10-04', time: '6PM', status: 'upcoming', zoomLink: '', recording: '' },
    ],
    notes: [],
    announcements: [],
    quizzes: [],
  },
  {
    id: 'ai-tools',
    title: 'AI Tools Mastery',
    description: 'ChatGPT, Midjourney, Claude, Perplexity, Runway, ElevenLabs.',
    instructor: 'Ramini Academy',
    duration: '4 weeks',
    level: 'Beginner',
    thumbnail: '/placeholder.svg',
    category: 'Beginner',
    totalClasses: 12,
    completedClasses: 0,
    progress: 0,
    schedule: [],
    notes: [],
    announcements: [],
    quizzes: [],
  },
  {
    id: 'powerpoint',
    title: 'MS PowerPoint',
    description: 'Advanced presentations, animations, templates, mastery.',
    instructor: 'Ramini Academy',
    duration: '2 weeks',
    level: 'Beginner',
    thumbnail: '/placeholder.svg',
    category: 'Beginner',
    totalClasses: 6,
    completedClasses: 0,
    progress: 0,
    schedule: [],
    notes: [],
    announcements: [],
    quizzes: [],
  },
  {
    id: 'excel',
    title: 'MS Excel',
    description: 'Formulas, PivotTables, Charts, VBA, Data Analysis.',
    instructor: 'Ramini Academy',
    duration: '6 weeks',
    level: 'Beginner',
    thumbnail: '/placeholder.svg',
    category: 'Beginner',
    totalClasses: 18,
    completedClasses: 0,
    progress: 0,
    schedule: [],
    notes: [],
    announcements: [],
    quizzes: [],
  },
];

async function seedCourses() {
  console.log('Seeding courses...');
  for (const course of courses) {
    await setDoc(doc(db, 'courses', course.id), course);
    console.log(`Seeded: ${course.title}`);
  }
  console.log('Done!');
}

seedCourses().catch(console.error);

