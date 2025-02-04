// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyByyd-1k7S3PqnFDcUm5d2G1_1L0du7yGA",
  authDomain: "onlydance-e1a4b.firebaseapp.com",
  projectId: "onlydance-e1a4b",
  storageBucket: "onlydance-e1a4b.appspot.com", // ✅ Fixed storageBucket
  messagingSenderId: "798213977831",
  appId: "1:798213977831:web:d882164592f2ef38015442",
  measurementId: "G-H3MBZHHLEX",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Analytics (Only if running in browser)
let analytics;
if (typeof window !== "undefined") {
  analytics = getAnalytics(app);
}

// Authentication
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();

// Firestore Database
export const db = getFirestore(app);
