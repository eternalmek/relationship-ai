import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: User must paste real keys from Console here
const firebaseConfig = {
  apiKey: "REPLACE_WITH_REAL_KEY",
  authDomain: "REPLACE_WITH_REAL_KEY",
  projectId: "REPLACE_WITH_REAL_KEY",
  storageBucket: "REPLACE_WITH_REAL_KEY",
  messagingSenderId: "REPLACE_WITH_REAL_KEY",
  appId: "REPLACE_WITH_REAL_KEY"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
