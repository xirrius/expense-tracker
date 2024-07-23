import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyD0nvMJbh5EDPoPgPu9BWW65jC00rLjThY",
  authDomain: "expense-tracker-c486d.firebaseapp.com",
  projectId: "expense-tracker-c486d",
  storageBucket: "expense-tracker-c486d.appspot.com",
  messagingSenderId: "560754391173",
  appId: "1:560754391173:web:f4ad936bb88cc3ea5851ec",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app)
export const db = getFirestore(app)
