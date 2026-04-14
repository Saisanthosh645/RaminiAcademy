import { collection, doc, setDoc, getDocs, deleteDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firestore";
import { courses } from "./seedCourses";
import type { Course, CourseProgress, User } from "@/types/firebase";

/**
 * Migrate course data from code to Firebase
 * Run this once to populate Firebase with course data
 */
export async function migrateCoursesToFirebase() {
  try {
    console.log("Starting course migration to Firebase...");

    for (const course of courses) {
      console.log(`Migrating course: ${course.title}`);
      await setDoc(doc(db, "courses", course.id), course);
    }

    console.log("✅ Course migration completed!");
    return { success: true, message: "All courses migrated to Firebase" };
  } catch (error) {
    console.error("❌ Course migration failed:", error);
    return { success: false, message: error instanceof Error ? error.message : "Unknown error" };
  }
}

/**
 * Update a specific course in Firebase
 */
export async function updateCourseInFirebase(courseId: string, updates: any) {
  try {
    await setDoc(doc(db, "courses", courseId), updates, { merge: true });
    console.log(`✅ Course ${courseId} updated in Firebase`);
    return { success: true };
  } catch (error) {
    console.error("❌ Course update failed:", error);
    return { success: false, message: error instanceof Error ? error.message : "Unknown error" };
  }
}

/**
 * Get all courses from Firebase (for admin panel)
 */
export async function getAllCoursesFromFirebase() {
  try {
    const querySnapshot = await getDocs(collection(db, "courses"));
    const courses: any[] = [];
    querySnapshot.forEach((doc) => {
      courses.push({ id: doc.id, ...doc.data() });
    });
    return courses;
  } catch (error) {
    console.error("Error fetching courses:", error);
    return [];
  }
}

/**
 * Bulk update Zoom links for all courses
 */
export async function bulkUpdateZoomLinks(zoomLinks: Record<string, string>) {
  try {
    const updates = Object.entries(zoomLinks).map(([courseId, zoomLink]) =>
      updateCourseInFirebase(courseId, {
        schedule: courses.find(c => c.id === courseId)?.schedule.map(session => ({
          ...session,
          meetLink: zoomLink
        })) || []
      })
    );

    await Promise.all(updates);
    console.log("✅ Bulk Zoom link update completed!");
    return { success: true };
  } catch (error) {
    console.error("❌ Bulk update failed:", error);
    return { success: false, message: error instanceof Error ? error.message : "Unknown error" };
  }
}

/**
 * Create a new course in Firebase
 */
export async function createCourseInFirebase(course: Course) {
  try {
    await setDoc(doc(db, "courses", course.id), course, { merge: false });
    console.log(`✅ Course ${course.id} created in Firebase`);
    return { success: true };
  } catch (error) {
    console.error("❌ Course create failed:", error);
    return { success: false, message: error instanceof Error ? error.message : "Unknown error" };
  }
}

/**
 * Delete a course from Firebase
 */
export async function deleteCourseFromFirebase(courseId: string) {
  try {
    await deleteDoc(doc(db, "courses", courseId));
    console.log(`✅ Course ${courseId} deleted from Firebase`);
    return { success: true };
  } catch (error) {
    console.error("❌ Course delete failed:", error);
    return { success: false, message: error instanceof Error ? error.message : "Unknown error" };
  }
}

/**
 * Get all users from Firebase (for admin panel)
 */
export async function getAllUsersFromFirebase() {
  try {
    const querySnapshot = await getDocs(collection(db, "users"));
    const users: Array<User & { uid: string }> = [];
    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data() as Omit<User, "uid">;
      users.push({ uid: docSnap.id, ...data });
    });
    return users;
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
}

/**
 * Update a specific user in Firebase
 */
export async function updateUserInFirebase(uid: string, updates: Partial<User> | Record<string, unknown>) {
  try {
    await updateDoc(doc(db, "users", uid), updates);
    console.log(`✅ User ${uid} updated in Firebase`);
    return { success: true };
  } catch (error) {
    console.error("❌ User update failed:", error);
    return { success: false, message: error instanceof Error ? error.message : "Unknown error" };
  }
}

/**
 * Create or merge a user profile in Firebase
 */
export async function createUserProfileInFirebase(payload: {
  uid: string;
  name: string;
  email: string;
  role?: User["role"];
}) {
  try {
    await setDoc(
      doc(db, "users", payload.uid),
      {
        name: payload.name,
        email: payload.email,
        role: payload.role || "student",
        enrolledCourses: [],
        paidCourses: [],
        progress: {} as Record<string, CourseProgress>,
        createdAt: serverTimestamp(),
        twoFactorEnabled: false,
      },
      { merge: true }
    );
    console.log(`✅ User profile ${payload.uid} created/merged in Firebase`);
    return { success: true };
  } catch (error) {
    console.error("❌ User profile create failed:", error);
    return { success: false, message: error instanceof Error ? error.message : "Unknown error" };
  }
}