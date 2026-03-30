/**
 * Firestore collection and path constants — single source of truth for DB structure.
 */
export const COLLECTIONS = {
  users: "users",
  courses: "courses",
} as const;

export const userDocPath = (uid: string) => `${COLLECTIONS.users}/${uid}`;
export const courseDocPath = (courseId: string) => `${COLLECTIONS.courses}/${courseId}`;
