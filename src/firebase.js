import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCCDq3Scs-FZ8gdqmEFW-ZsvaJ9rv5AXMA",
  authDomain: "veyl-a8ced.firebaseapp.com",
  projectId: "veyl-a8ced",
  storageBucket: "veyl-a8ced.firebasestorage.app",
  messagingSenderId: "233353511640",
  appId: "1:233353511640:web:39669aa65e448aae5a8dad"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };

