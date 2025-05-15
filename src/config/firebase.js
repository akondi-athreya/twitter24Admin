// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD-ort1bzWqy5inzHer4docnXzPvk0JvdQ",
  authDomain: "twitter24-b7e6e.firebaseapp.com",
  projectId: "twitter24-b7e6e",
  storageBucket: "twitter24-b7e6e.appspot.com",
  messagingSenderId: "74635018217",
  appId: "1:74635018217:web:6da2cb03e44d7026d85578",
  measurementId: "G-C77MBDZQG3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

export { auth, signInWithPopup, GoogleAuthProvider };