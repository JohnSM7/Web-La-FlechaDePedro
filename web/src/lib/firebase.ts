import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyDd0HKixIMWeEr7EksMMGK1PwZ9bRVlidQ",
  authDomain: "la-flecha-pedro.firebaseapp.com",
  projectId: "la-flecha-pedro",
  storageBucket: "la-flecha-pedro.firebasestorage.app",
  messagingSenderId: "714334767241",
  appId: "1:714334767241:web:d4401e26cc51c19d881e58",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
