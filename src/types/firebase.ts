export interface ScheduleItem {
  id: string;
  topic: string;
  date: string;
  time: string;
  status: "upcoming" | "live" | "completed";
  meetLink?: string;
  recordingUrl?: string;
  quiz?: Quiz;
}

export interface Note {
  id: string;
  title: string;
  description: string;
  fileUrl: string;
  type: "pdf" | "doc" | "ppt";
}

export interface Announcement {
  id: string;
  title: string;
  message: string;
  date: string;
  priority: "normal" | "urgent";
}

export interface QuizTestCase {
  input: string;
  expectedOutput: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  type?: "multiple-choice" | "coding";
  options: string[]; // Options for multiple choice
  correctAnswer: number; // Index for multiple choice
  starterCode?: string; // Starter code for coding question
  testCases?: QuizTestCase[]; // Test cases for coding question
}

export interface Quiz {
  id: string;
  title: string;
  topic: string;
  questions: QuizQuestion[];
  isFinalExam?: boolean;
}

export interface QuizResult {
  id: string;
  quizId: string;
  courseId: string;
  userId: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  passed: boolean;
  completedAt: string; // ISO string
}

export interface SyllabusItem {
  week: number;
  topic: string;
  description: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  thumbnail: string;
  duration: string;
  level: "Beginner" | "Intermediate";
  progress: number;
  schedule: ScheduleItem[];
  notes: Note[];
  announcements: Announcement[];
  quizzes?: Quiz[];
  finalQuiz?: Quiz;
  totalClasses: number;
  completedClasses: number;
  category: string;
  price: number;
  originalPrice?: number;
  isBestSeller?: boolean;
  syllabus?: SyllabusItem[];
  isPaid?: boolean;
}

export interface CourseProgress {
  completedClasses: number;
  totalClasses: number;
  quizScore: number;
  completed: boolean;
  certificateDate?: string; // ISO string for Firestore compatibility
  isPaid?: boolean;
  completedLessons?: string[]; // IDs of ScheduleItems that the user has completed
}

export interface Payment {
  id: string;
  userId: string;
  courseId: string;
  amount: number;
  status: "pending" | "success" | "failed";
  createdAt: string; // ISO string
  completedAt?: string; // ISO string
}

export interface User {
  uid: string;
  name: string;
  email: string;
  avatar?: string;
  /** From Firebase Auth (not stored on user doc by default) */
  photoURL?: string | null;
  enrolledCourses: string[];
  paidCourses: string[]; // Courses user has paid for
  progress: Record<string, CourseProgress>;
  createdAt: Date;
}

export interface Certificate {
  id: string; // The RAMINI-... ID
  userId: string;
  userName: string;
  courseId: string;
  courseName: string;
  score: number;
  dateOfIssue: string; // ISO string
  verificationUrl: string;
  qrCode?: string; // Base64 image
}

export type { FirebaseUser } from "../firebase/auth";

