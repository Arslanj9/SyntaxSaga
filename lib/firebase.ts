// lib/firebase.ts - Firebase configuration and initialization

import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Validate Firebase configuration (only on client side)
if (typeof window !== 'undefined') {
  if (!firebaseConfig.apiKey || !firebaseConfig.authDomain || !firebaseConfig.projectId) {
    console.error('Firebase configuration is missing required values. Please check your .env file.');
    console.error('Firebase Config:', {
      apiKey: firebaseConfig.apiKey ? '✓' : '✗',
      authDomain: firebaseConfig.authDomain ? '✓' : '✗',
      projectId: firebaseConfig.projectId ? '✓' : '✗',
    });
  }
}

// Initialize Firebase (only on client side)
let app: FirebaseApp | undefined;
let auth: Auth | undefined;

if (typeof window !== 'undefined') {
  if (getApps().length === 0) {
    try {
      app = initializeApp(firebaseConfig);
    } catch (error) {
      console.error('Error initializing Firebase:', error);
      throw error;
    }
  } else {
    app = getApps()[0];
  }

  // Initialize Firebase Auth
  auth = getAuth(app);
}

export { auth };
export default app;

