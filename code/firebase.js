// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage"; // ✅ Import Firebase Storage
import dotenv from 'dotenv';

dotenv.config();

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: "onlydance-e1a4b.firebaseapp.com",
  projectId: "onlydance-e1a4b",
  storageBucket: "onlydance-e1a4b.appspot.com", // FIXED storageBucket format
  messagingSenderId: "798213977831",
  appId: "1:798213977831:web:d882164592f2ef38015442",
  measurementId: "G-H3MBZHHLEX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app); // ✅ Initialize Storage

// Initialize Analytics (if running in the browser)
let analytics;
if (typeof window !== "undefined") {
  analytics = getAnalytics(app);
}

// Authentication
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();

// Firestore Database
export const db = getFirestore(app);

export { storage };
