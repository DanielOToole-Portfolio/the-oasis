import Firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import "firebase/storage";

const config = {
  apiKey: "AIzaSyBBwxd_qiYuGLItVqwv59_hO42vxItuNJM",
  authDomain: "the-oasis-2b386.firebaseapp.com",
  projectId: "the-oasis-2b386",
  storageBucket: "the-oasis-2b386.appspot.com",
  messagingSenderId: "491502966638",
  appId: "1:491502966638:web:35b6c007ad6356ae2a937f",
};

const firebase = Firebase.initializeApp(config);
const { FieldValue } = Firebase.firestore;

const db = Firebase.firestore();
const storage = Firebase.storage();
const timestamp = Firebase.firestore.FieldValue.serverTimestamp;

export { firebase, FieldValue, db, storage, timestamp };
