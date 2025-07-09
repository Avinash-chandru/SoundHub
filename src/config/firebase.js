import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBNpmaXi0VFpPgVKeF8TY7mRn2KyFUHQRc",
  authDomain: "soundhub-fe6bd.firebaseapp.com",
  projectId: "soundhub-fe6bd",
  storageBucket: "soundhub-fe6bd.firebasestorage.app",
  messagingSenderId: "815562038008",
  appId: "1:815562038008:web:f2314dce000b617810f90d",
  measurementId: "G-GB85FH6N2Z"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const db = getFirestore(app);

try {
  console.log('Firebase initialized successfully');
} catch (error) {
  console.error('Firebase initialization error:', error);
}
export default app;