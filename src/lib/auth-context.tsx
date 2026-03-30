import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthChanged, loginEmail, signupEmail, loginGoogle, logout as firebaseLogout } from "@/firebase/auth";
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
                },
                { merge: true }
              );
              // Next snapshot will load the new doc and clear loading
              return;
            }

            const next = userFromFirestoreSnapshot(firebaseUser.uid, snap, firebaseUser.photoURL);
            if (next) setUser(next);
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
    }
  };

  const loginWithGoogle = async () => {
    await loginGoogle();
  };

  const logout = async () => {
    await firebaseLogout();
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, loginWithGoogle, logout }}>
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
