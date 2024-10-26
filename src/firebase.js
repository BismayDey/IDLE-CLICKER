// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDoSFLR7a6n9uJUXY56HWLxAlkgNrpM-aQ",
  authDomain: "css-battle-252c2.firebaseapp.com",
  projectId: "css-battle-252c2",
  storageBucket: "css-battle-252c2.appspot.com",
  messagingSenderId: "945733803664",
  appId: "1:945733803664:web:6e0038db22a2d250440215",
  measurementId: "G-G4067YY9W1",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
