import firebase from "firebase/compat/app";
import 'firebase/compat/auth'

import { getFirestore } from "firebase/firestore";

const appFirebase = firebase.initializeApp({
  apiKey: "AIzaSyDQMrCAob_f7s5__yHz0gGp-emWqTWNTsg",
  authDomain: "fir-auth-14b45.firebaseapp.com",
  projectId: "fir-auth-14b45",
  storageBucket: "fir-auth-14b45.appspot.com",
  messagingSenderId: "702814096285",
  appId: "1:702814096285:web:ea07c77521d98723b7fd74",
  measurementId: "G-8NPYRQDHP2",
});

export const auth = appFirebase.auth();
export const db = getFirestore(appFirebase);


export default appFirebase;
