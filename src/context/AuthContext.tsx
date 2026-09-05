import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User, onAuthStateChanged } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import {
  auth,
  db,
  signInWithGoogle,
  logOut,
  saveUserPreferences,
  AuthErrorFeedback,
} from "../lib/firebase";

export interface UserProfileData {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role?: string;
  organization?: string;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfileData | null;
  loading: boolean;
  authError: AuthErrorFeedback | null;
  clearAuthError: () => void;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  savePreferences: (prefs: { selectedAssetId?: string; isArabic?: boolean; soundEnabled?: boolean }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<AuthErrorFeedback | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);

      if (firebaseUser) {
        setAuthError(null);
        // Listen to Firestore profile
        const userRef = doc(db, "users", firebaseUser.uid);
        const unsubDoc = onSnapshot(
          userRef,
          (snap) => {
            if (snap.exists()) {
              setProfile(snap.data() as UserProfileData);
            } else {
              setProfile({
                uid: firebaseUser.uid,
                email: firebaseUser.email || "",
                displayName: firebaseUser.displayName || "مستخدم معتمد",
                photoURL: firebaseUser.photoURL || "",
                role: "judicial_officer",
                organization: "مركز الإسناد والتصفية (إنفاذ)",
              });
            }
          },
          (err) => {
            console.warn("Firestore user listener error:", err);
          }
        );
        return () => unsubDoc();
      } else {
        setProfile(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleSignIn = async () => {
    setAuthError(null);
    try {
      const res = await signInWithGoogle();
      if (res.error) {
        setAuthError(res.error);
      }
    } catch (err: any) {
      console.error("Login caught in handleSignIn:", err);
    }
  };

  const handleSignOut = async () => {
    setAuthError(null);
    try {
      await logOut();
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const clearAuthError = () => {
    setAuthError(null);
  };

  const handleSavePreferences = async (prefs: {
    selectedAssetId?: string;
    isArabic?: boolean;
    soundEnabled?: boolean;
  }) => {
    if (user) {
      await saveUserPreferences(user.uid, prefs);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        authError,
        clearAuthError,
        signIn: handleSignIn,
        signOut: handleSignOut,
        savePreferences: handleSavePreferences,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
