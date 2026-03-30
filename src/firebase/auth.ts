import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged, User as AuthUser } from "firebase/auth";
import { app } from "./config";

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('email');
googleProvider.setCustomParameters({ prompt: 'select_account' });

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

export { auth as default };


