import { collection, doc, setDoc, getDocs } from "firebase/firestore";
import { db } from "./firestore";
import { courses } from "./seedCourses";

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
    return { success: false, message: error.message };
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
    return { success: false, message: error.message };
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
    return { success: false, message: error.message };
  }
}