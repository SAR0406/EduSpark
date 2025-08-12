
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Enhanced debugging logs for setup verification
if (typeof window !== 'undefined') {
  console.log("Firebase Lib: Attempting to initialize Firebase on client...");
  if (!firebaseConfig.apiKey) {
    console.error("CRITICAL ERROR (Firebase Lib): NEXT_PUBLIC_FIREBASE_API_KEY is missing. Ensure it's in your .env.local file and the Next.js server was restarted.");
  }
}

// Initialize Firebase
let app;
if (!getApps().length) {
  try {
    app = initializeApp(firebaseConfig);
  } catch (e) {
    console.error("Firebase initialization failed:", e);
    // In a real app, you might want to show a more user-friendly error
    // or disable Firebase-dependent features.
    throw new Error("Could not initialize Firebase. Please check your configuration.");
  }
} else {
  app = getApp();
}

const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
