import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged, User as AuthUser, sendEmailVerification, sendPasswordResetEmail, setPersistence, browserLocalPersistence } from "firebase/auth";
import { app } from "./config";

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('email');
googleProvider.setCustomParameters({ prompt: 'select_account' });

// Enable persistent auth
setPersistence(auth, browserLocalPersistence).catch(console.error);

export interface FirebaseUser extends Omit<AuthUser, 'uid'> {
  uid: string;
  displayName?: string | null;
  photoURL?: string | null;
}

// Auth functions
export const loginEmail = (email: string, password: string) => signInWithEmailAndPassword(auth, email, password);
export const signupEmail = (email: string, password: string) => createUserWithEmailAndPassword(auth, email, password);
export const loginGoogle = () => signInWithPopup(auth, googleProvider);
export const logout = () => signOut(auth);
export const onAuthChanged = (cb: (user: AuthUser | null) => void) => onAuthStateChanged(auth, cb);

/**
 * Send email verification link to user
 */
export const sendVerificationEmail = async (user: AuthUser): Promise<void> => {
  await sendEmailVerification(user, {
    url: `${window.location.origin}/verify-email`,
    handleCodeInApp: true,
  });
};

/**
 * Send password reset email
 */
export const sendResetEmail = async (email: string): Promise<void> => {
  await sendPasswordResetEmail(auth, email, {
    url: `${window.location.origin}/reset-password`,
    handleCodeInApp: true,
  });
};

export { auth as default };



