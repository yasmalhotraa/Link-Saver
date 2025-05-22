// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.FIREBASE_API_KEY,
  authDomain: "linksaver-46235.firebaseapp.com",
  projectId: "linksaver-46235",
  storageBucket: "linksaver-46235.firebasestorage.app",
  messagingSenderId: "406696989108",
  appId: "1:406696989108:web:018a74a660b6547d2c22e1",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { app, auth };
