'use client';

import { initializeApp, getApps } from 'firebase/app';
import {
  getAuth,
  signInWithCustomToken,
  signOut,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// if (!firebase?.apps?.length) {
//   firebase.initializeApp(firebaseConfig);
// }
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);
const db = getFirestore(app);
const googleAuthProvider = new GoogleAuthProvider();

googleAuthProvider.setCustomParameters({
  prompt: 'select_account',
});

const signInWithGooglePopup = async () => await signInWithPopup(auth, googleAuthProvider);
const authWithCustomToken = async (token: string) => await signInWithCustomToken(auth, token);
const authSendPasswordResetEmail = async (email: string) => await sendPasswordResetEmail(auth, email);
const authSignOut = async () => await signOut(auth);

export const FirebaseClient = {
  auth,
  db,
  signInWithGooglePopup,
  signInWithEmailAndPassword,
  authWithCustomToken,
  authSignOut,
  authSendPasswordResetEmail,
};
