import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getDatabase } from 'firebase/database';
import { getStorage } from 'firebase/storage';

/**
 * Firebase config
 * - แนะนำให้เก็บค่าเหล่านี้ใน environment variables (.env.local)
 * - ถ้าต้องการทดสอบเร็ว ๆ ให้ใส่ fallback values ด้านล่าง แต่ห้าม commit ขึ้น public repo
 */
export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyBhprcnCRZVHE3df9wvK9VkQdSUwiGw11E",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "meechainmeebot-v1-218162-261fc.firebaseapp.com",
  databaseURL:
    process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL ||
    "https://meechainmeebot-v1-218162-261fc-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "meechainmeebot-v1-218162-261fc",
  storageBucket:
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "meechainmeebot-v1-218162-261fc.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "412472571465",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:412472571465:web:145cee31cd68b9811ff198",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-FY1ZDBVR5X",
};

// Initialize Firebase app only once
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Export commonly-used services
export const firebaseAuth = getAuth(app);
export const firestore = getFirestore(app);
export const realtimeDB = getDatabase(app);
export const storage = getStorage(app);

export default app;
