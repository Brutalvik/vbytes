import { getApp, getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_CRM_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_CRM_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_CRM_PROJECT_ID!,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_CRM_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_CRM_MESSAGING_SENDER_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_CRM_APP_ID!,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_CRM_MEASUREMENT_ID,
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const db = getFirestore(app);
export const auth = getAuth(app);
export const APP_ID = process.env.NEXT_PUBLIC_FIREBASE_CRM_APP_ID!;
