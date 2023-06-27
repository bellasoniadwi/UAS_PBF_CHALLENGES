// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAiY4ON6MY-OSIVq_saFXhw40CwVn93wc4",
  authDomain: "uas-pbf-63592.firebaseapp.com",
  projectId: "uas-pbf-63592",
  storageBucket: "uas-pbf-63592.appspot.com",
  messagingSenderId: "1014983052566",
  appId: "1:1014983052566:web:bd1b8c709160575a58d437",
  measurementId: "G-057NVH748T"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore();
export { db }