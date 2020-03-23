import firebase from "firebase/app";
import "firebase/firestore";

// Initialize Cloud Firestore through Firebase
firebase.initializeApp({
  apiKey: "AIzaSyA1ZEKJo_IT5uHhKzjIrusTDI_EyqQVRhg",
  authDomain: "messages-ed8ae.firebaseapp.com",
  databaseURL: "https://messages-ed8ae.firebaseio.com",
  projectId: "messages-ed8ae",
  storageBucket: "messages-ed8ae.appspot.com",
  messagingSenderId: "38568676566",
  appId: "1:38568676566:web:44f7a7b8a1470d5ab80d77",
  measurementId: "G-7LTKDNHMLW"
});

export default firebase.firestore();
