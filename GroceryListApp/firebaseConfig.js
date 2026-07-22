
import { initializeApp } from 'firebase/app';
import {getAuth, 
  GoogleAuthProvider, 
  signInWithCredential ,onAuthStateChanged } from 'firebase/auth';  


import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyC9bfGQpJoWedO9D-x3Wawoxbfgk0Y7uwY",
    authDomain: "grocerylistapp-ca528.firebaseapp.com",
    projectId: "grocerylistapp-ca528",
    storageBucket: "grocerylistapp-ca528.firebasestorage.app",
    messagingSenderId: "117744182937",
    appId: "1:117744182937:web:cb448e3fbfa316c901ba08"
  };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export {auth};
export const db = getFirestore(app);

// export { auth, db, googleProvider, signInWithCredential };