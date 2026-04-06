import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthChanged, loginEmail, signupEmail, loginGoogle, logout as firebaseLogout, sendVerificationEmail } from "@/firebase/auth";
import { updateProfile } from "firebase/auth";
import { onSnapshot, setDoc, serverTimestamp } from "firebase/firestore";
import { usersRef, userFromFirestoreSnapshot } from "@/firebase/firestore";
import type { User } from "@/types/firebase";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  sendEmailVerification: (email: string) => Promise<void>;
  resendVerificationEmail: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let firestoreUnsub: (() => void) | undefined;

    const authUnsub = onAuthChanged((firebaseUser) => {
      firestoreUnsub?.();
      firestoreUnsub = undefined;

      if (!firebaseUser) {
        setUser(null);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      const ref = usersRef(firebaseUser.uid);

      firestoreUnsub = onSnapshot(
        ref,
        async (snap) => {
          try {
            if (!snap.exists()) {
              await setDoc(
                ref,
                {
                  name: firebaseUser.displayName || "User",
                  email: firebaseUser.email || "",
                  enrolledCourses: [],
                  paidCourses: [],
                  progress: {},
                  createdAt: serverTimestamp(),
                  emailVerified: firebaseUser.emailVerified,
                  role: "student",
                  twoFactorEnabled: false,
                },
                { merge: true }
              );
              // Next snapshot will load the new doc and clear loading
              return;
            }

            const next = userFromFirestoreSnapshot(firebaseUser.uid, snap, firebaseUser.photoURL);
            if (next) {
              // Update emailVerified from Firebase Auth
              next.emailVerified = firebaseUser.emailVerified;
              setUser(next);
            }
            setIsLoading(false);
          } catch (e) {
            console.error("Firestore user profile sync error:", e);
            setIsLoading(false);
          }
        },
        (error) => {
          console.error("Firestore user listener error:", error);
          setUser({
            uid: firebaseUser.uid,
            name: firebaseUser.displayName || "User",
            email: firebaseUser.email || "",
            photoURL: firebaseUser.photoURL,
            enrolledCourses: [],
            paidCourses: [],
            progress: {},
            createdAt: new Date(),
            emailVerified: firebaseUser.emailVerified,
            role: "student",
            twoFactorEnabled: false,
          });
          setIsLoading(false);
        }
      );
    });

    return () => {
      authUnsub();
      firestoreUnsub?.();
    };
  }, []);

  const login = async (email: string, password: string) => {
    await loginEmail(email, password);
  };

  const signup = async (name: string, email: string, password: string) => {
    const userCredential = await signupEmail(email, password);
    if (userCredential.user) {
      await updateProfile(userCredential.user, { displayName: name });
      // Send verification email
      await sendVerificationEmail(userCredential.user);
    }
  };

  const loginWithGoogle = async () => {
    await loginGoogle();
  };

  const logout = async () => {
    await firebaseLogout();
  };

  const sendEmailVerificationToUser = async (email: string) => {
    // This is a utility for resending verification emails
    // In a real app, you'd have a Cloud Function that sends this
    console.log("Verification email will be sent to:", email);
  };

  const resendVerificationEmail = async () => {
    if (!auth.currentUser) {
      throw new Error("No user logged in");
    }
    await sendVerificationEmail(auth.currentUser);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        signup,
        loginWithGoogle,
        logout,
        sendEmailVerification: sendEmailVerificationToUser,
        resendVerificationEmail,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
