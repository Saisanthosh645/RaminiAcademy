import { getFirestore, doc, collection } from "firebase/firestore";
import { app } from "./config";
import { COLLECTIONS } from "./collections";
import type { CourseProgress, User } from "../types/firebase";
import type { DocumentData, DocumentSnapshot } from "firebase/firestore";

export const db = getFirestore(app);

/** User profile document: `users/{uid}` */
export const usersRef = (uid: string) => doc(db, COLLECTIONS.users, uid);
export const usersCollection = collection(db, COLLECTIONS.users);

/** All course catalog documents */
export const coursesCollection = collection(db, COLLECTIONS.courses);

export const coursesRef = (courseId: string) => doc(db, COLLECTIONS.courses, courseId);

/** Optional subcollection pattern (not used by current app logic) */
export const userCoursesRef = (uid: string) => collection(db, COLLECTIONS.users, uid, "enrolledCourses");

/**
 * Map a Firestore `users/{uid}` snapshot into the app `User` shape.
 */
export function userFromFirestoreSnapshot(
  uid: string,
  snap: DocumentSnapshot<DocumentData>,
  photoURL?: string | null
): User | null {
  if (!snap.exists()) return null;
  const data = snap.data();
  const createdAt =
    data.createdAt && typeof data.createdAt.toDate === "function"
      ? data.createdAt.toDate()
      : new Date();

  return {
    uid,
    name: typeof data.name === "string" ? data.name : "User",
    email: typeof data.email === "string" ? data.email : "",
    avatar: typeof data.avatar === "string" ? data.avatar : undefined,
    enrolledCourses: Array.isArray(data.enrolledCourses) ? data.enrolledCourses : [],
    paidCourses: Array.isArray(data.paidCourses) ? data.paidCourses : [],
    progress: data.progress && typeof data.progress === "object" ? (data.progress as Record<string, CourseProgress>) : {},
    createdAt,
    photoURL: photoURL ?? null,
    role: data.role === "admin" || data.role === "teacher" || data.role === "student" ? data.role : "student",
    twoFactorEnabled: Boolean(data.twoFactorEnabled),
    emailVerified: typeof data.emailVerified === "boolean" ? data.emailVerified : undefined,
  };
}

export type { User, Course } from "../types/firebase";


