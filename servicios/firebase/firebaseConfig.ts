import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD4CSV2aZ-BnLA5C_Tn9wL3A4hvDUT1gT8",
  authDomain: "sumativa-74d0a.firebaseapp.com",
  projectId: "sumativa-74d0a",
  storageBucket: "sumativa-74d0a.firebasestorage.app",
  messagingSenderId: "1076516348586",
  appId: "1:1076516348586:web:a55114a2a6ab6b37b526d3",
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);