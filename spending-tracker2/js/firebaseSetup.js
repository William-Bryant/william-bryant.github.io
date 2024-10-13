// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { getDatabase, ref, push, onValue } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-database.js";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDJ2Tvz3gEXxWX84vgPu2iaL7KAKQhGiJ8",
  authDomain: "spending-tracker-ff085.firebaseapp.com",
  databaseURL: "https://spending-tracker-ff085-default-rtdb.firebaseio.com",
  projectId: "spending-tracker-ff085",
  storageBucket: "spending-tracker-ff085.appspot.com",
  messagingSenderId: "52939317884",
  appId: "1:52939317884:web:ed5ae59d91ac3991891ff9",
  measurementId: "G-3577L87M9Q"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app); // For Realtime Database

export { db }


