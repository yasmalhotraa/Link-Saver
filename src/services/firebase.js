// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAS5KMOLKMXWZLlny2CrXueif7iewH0K0U",
  authDomain: "linksaver-46235.firebaseapp.com",
  projectId: "linksaver-46235",
  storageBucket: "linksaver-46235.appspot.com",
  messagingSenderId: "406696989108",
  appId: "1:406696989108:web:018a74a660b6547d2c22e1",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
