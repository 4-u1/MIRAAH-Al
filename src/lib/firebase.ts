import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut as fbSignOut,
  onAuthStateChanged,
  User,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  onSnapshot,
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import firebaseConfig from "../../firebase-applet-config.json";

// Initialize Firebase App safely (singleton)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Auth
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: "select_account",
});

// Initialize Firestore (pointing to custom databaseId if configured)
export const db = firebaseConfig.firestoreDatabaseId
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

// Concurrency mutex lock for popup sign-in
let isSigningIn = false;

// Custom error type for UI notification
export interface AuthErrorFeedback {
  type: "popup_blocked" | "cancelled" | "general";
  message: string;
  messageArabic: string;
}

// Sign in with Google Popup with debouncing & robust error handling
export async function signInWithGoogle(): Promise<{ user: User | null; error?: AuthErrorFeedback }> {
  // Prevent duplicate concurrent popup requests
  if (isSigningIn) {
    console.warn("Sign-in already in progress, ignoring duplicate request.");
    return { user: null };
  }

  isSigningIn = true;
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    // Upsert user profile in Firestore
    if (user) {
      const userRef = doc(db, "users", user.uid);
      await setDoc(
        userRef,
        {
          uid: user.uid,
          email: user.email || "",
          displayName: user.displayName || "مستخدم معتمد",
          photoURL: user.photoURL || "",
          role: "judicial_officer",
          organization: "مركز الإسناد والتصفية (إنفاذ)",
          lastLogin: new Date().toISOString(),
        },
        { merge: true }
      );
    }
    return { user };
  } catch (error: any) {
    const errorCode = error?.code || "";
    
    // Check for popup blocked (e.g. browser strict settings or iframe sandbox)
    if (errorCode === "auth/popup-blocked") {
      console.warn("Firebase popup was blocked by the browser. Prompting user to allow popups or open in new tab.");
      return {
        user: null,
        error: {
          type: "popup_blocked",
          message: "Popup was blocked by your browser. Please allow popups or open the app in a new tab.",
          messageArabic: "تم حظر النافذة المنبثقة بواسطة المتصفح. يرجى السماح بالنوافذ المنبثقة أو فتح التطبيق في تبويب جديد.",
        },
      };
    }

    // Check for user cancelled / closed popup or cancelled-popup-request
    if (
      errorCode === "auth/cancelled-popup-request" ||
      errorCode === "auth/popup-closed-by-user"
    ) {
      console.info("Sign-in popup closed or superseded.");
      return {
        user: null,
        error: {
          type: "cancelled",
          message: "Sign-in was cancelled.",
          messageArabic: "تم إلغاء عملية تسجيل الدخول.",
        },
      };
    }

    console.error("Firebase Google Sign-In error:", error);
    return {
      user: null,
      error: {
        type: "general",
        message: error?.message || "Authentication error occurred.",
        messageArabic: "حدث خطأ أثناء تسجيل الدخول. يرجى المحاولة مرة أخرى.",
      },
    };
  } finally {
    isSigningIn = false;
  }
}

// Sign out
export async function logOut(): Promise<void> {
  try {
    await fbSignOut(auth);
  } catch (error) {
    console.error("Firebase Sign-Out failed:", error);
    throw error;
  }
}

// Save User Preferences to Firestore
export async function saveUserPreferences(
  userId: string,
  prefs: {
    selectedAssetId?: string;
    isArabic?: boolean;
    soundEnabled?: boolean;
  }
) {
  try {
    const prefRef = doc(db, "users", userId, "preferences", "default");
    await setDoc(
      prefRef,
      {
        ...prefs,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
  } catch (error) {
    console.warn("Could not save preferences to Firestore:", error);
  }
}

// Log inspection audit record to Firestore
export async function logInspectionAudit(
  userId: string,
  userEmail: string,
  audit: {
    assetId: string;
    findingId: number;
    verified: boolean;
    isResolved: boolean;
    actionTaken?: string;
    notes?: string;
  }
) {
  try {
    const auditColl = collection(db, "inspections");
    await addDoc(auditColl, {
      ...audit,
      inspectorUid: userId,
      inspectorEmail: userEmail,
      timestamp: new Date().toISOString(),
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    console.warn("Could not write inspection audit log to Firestore:", error);
  }
}
