import { initializeApp, type FirebaseOptions } from "firebase/app";

/**
 * Prefer VITE_* env vars in `.env` / hosting config.
 * Fallback values match the Ramini Academy project (public client config).
 */
const firebaseConfig: FirebaseOptions = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY ?? "AIzaSyDyVX2PrWecJz1HLnFfNRyjkERs2B9YxoU",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ?? "ramini-academy.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID ?? "ramini-academy",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ?? "ramini-academy.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ?? "39630488089",
  appId: import.meta.env.VITE_FIREBASE_APP_ID ?? "1:39630488089:web:18b6e0a6b14c290e17a088",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID ?? "G-X6BK16YW0D",
};

export const app = initializeApp(firebaseConfig);