
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getFirestore }from 'firebase/firestore'
import { getStorage } from "firebase/storage"

const firebaseConfig = {
  apiKey: "AIzaSyBvdyM907bGvtxdKZSI_Ogzz65Rv2xo2jI",
  authDomain: "fir-course-67fd5.firebaseapp.com",
  projectId: "fir-course-67fd5",
  storageBucket: "fir-course-67fd5.appspot.com",
  messagingSenderId: "832764194393",
  appId: "1:832764194393:web:4e19abf95b261816ef4b48",
  measurementId: "G-MMD61N4GCD"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)

export const googleProvider = new GoogleAuthProvider()

export const db = getFirestore(app)
export const storage = getStorage(app)