import firebase from "firebase/compat/app";
import 'firebase/compat/auth'
import "firebase/compat/firestore";
import  "firebase/compat/storage"


import {
  APIKEY,
  AUTH_DOMAIN,
  PROJECT_ID,
  STORAGE_BUCKET,
  MESSAGEING_SENDER_ID,
  APP_ID,
  MEASUREMENT_ID,
} from "@env";




const appFirebase = firebase.initializeApp({
  apiKey: APIKEY,
  authDomain: AUTH_DOMAIN,
  projectId: PROJECT_ID,
  storageBucket: STORAGE_BUCKET,
  messagingSenderId: MESSAGEING_SENDER_ID,
  appId: APP_ID,
  measurementId: MEASUREMENT_ID,
});

export const auth = appFirebase.auth();
export const db = appFirebase.firestore();
export const storage = appFirebase.storage();


export default appFirebase;
