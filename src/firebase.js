import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase configuration using Vite environment variables
// Set these in your .env file: VITE_FIREBASE_API_KEY, VITE_FIREBASE_AUTH_DOMAIN, etc.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "REPLACE_WITH_REAL_KEY",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "REPLACE_WITH_REAL_KEY",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "REPLACE_WITH_REAL_KEY",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "REPLACE_WITH_REAL_KEY",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "REPLACE_WITH_REAL_KEY",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "REPLACE_WITH_REAL_KEY"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
