// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDfFDgE9KajaMLDJZ0U_J4t8NS_9pQFQuk",
  authDomain: "studio-1702146042-d9ad1.firebaseapp.com",
  projectId: "studio-1702146042-d9ad1",
  storageBucket: "studio-1702146042-d9ad1.firebasestorage.app",
  messagingSenderId: "281948024409",
  appId: "1:281948024409:web:97d5fb4b27aa1a10ba0b48",
  measurementId: "G-7VS37CX8NJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);