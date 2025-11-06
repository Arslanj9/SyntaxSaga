// lib/auth.ts - Firebase authentication functions

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
  UserCredential,
} from 'firebase/auth';
import { auth } from './firebase';

// Ensure auth is available
if (typeof window !== 'undefined' && !auth) {
  console.error('Firebase Auth is not initialized. Please check your Firebase configuration.');
}

export interface AuthResponse {
  user: User;
  message: string;
}

// Sign In
export async function login(email: string, password: string): Promise<AuthResponse> {
  if (!auth) {
    throw new Error('Firebase Auth is not initialized. Please refresh the page and try again.');
  }
  try {
    const userCredential: UserCredential = await signInWithEmailAndPassword(auth, email, password);
    return {
      user: userCredential.user,
      message: 'Successfully signed in',
    };
  } catch (error: any) {
    console.error('Login error:', error);
    let errorMessage = 'Failed to sign in';
    if (error.code) {
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email';
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = 'Incorrect password';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address';
      } else if (error.code === 'auth/user-disabled') {
        errorMessage = 'This account has been disabled';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Too many failed attempts. Please try again later';
      } else if (error.code === 'auth/invalid-credential') {
        errorMessage = 'Invalid email or password';
      } else {
        errorMessage = error.message || `Authentication error: ${error.code}`;
      }
    } else {
      errorMessage = error.message || 'Failed to sign in. Please check your connection and try again.';
    }
    throw new Error(errorMessage);
  }
}

// Sign Up
export async function register(email: string, password: string): Promise<AuthResponse> {
  if (!auth) {
    throw new Error('Firebase Auth is not initialized. Please refresh the page and try again.');
  }
  try {
    const userCredential: UserCredential = await createUserWithEmailAndPassword(auth, email, password);
    return {
      user: userCredential.user,
      message: 'Successfully registered',
    };
  } catch (error: any) {
    let errorMessage = 'Failed to register';
    if (error.code === 'auth/email-already-in-use') {
      errorMessage = 'An account with this email already exists';
    } else if (error.code === 'auth/invalid-email') {
      errorMessage = 'Invalid email address';
    } else if (error.code === 'auth/operation-not-allowed') {
      errorMessage = 'Email/password accounts are not enabled';
    } else if (error.code === 'auth/weak-password') {
      errorMessage = 'Password is too weak';
    }
    throw new Error(errorMessage);
  }
}

// Sign Out
export async function logout(): Promise<void> {
  if (!auth) {
    throw new Error('Firebase Auth is not initialized');
  }
  try {
    await signOut(auth);
  } catch (error: any) {
    throw new Error(error.message || 'Failed to sign out');
  }
}

// Get current user
export function getCurrentUser(): User | null {
  if (!auth) return null;
  return auth.currentUser;
}

// Check if user is authenticated
export function isAuthenticated(): boolean {
  if (!auth) return false;
  return auth.currentUser !== null;
}

// Listen to auth state changes
export function onAuthStateChange(callback: (user: User | null) => void): () => void {
  if (!auth) {
    console.error('Firebase Auth is not initialized');
    return () => {}; // Return empty unsubscribe function
  }
  return onAuthStateChanged(auth, callback);
}
