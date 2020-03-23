import firebase from "firebase/app";
import "firebase/firestore";

// Initialize Cloud Firestore through Firebase
firebase.initializeApp({
    apiKey: "AIzaSyAGdN936LVkCtuPTtr6v5FL9mEtrxzB82U",
    authDomain: "parkingapp-a7028.firebaseapp.com",
    databaseURL: "https://parkingapp-a7028.firebaseio.com",
    projectId: "parkingapp-a7028",
    storageBucket: "parkingapp-a7028.appspot.com",
    messagingSenderId: "726593097057",
    appId: "1:726593097057:web:80d600fa9617ab85354920",
    measurementId: "G-GRDX81Q2X1"
});

export default firebase.firestore();
