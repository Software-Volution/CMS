/*// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCbpV8MdF5jYrVHXSdoe1TiwXPccDS_Wis",
    authDomain: "lcms-72b1a.firebaseapp.com",
    projectId: "lcms-72b1a",
    storageBucket: "lcms-72b1a.appspot.com",
    messagingSenderId: "537603097455",
    appId: "1:537603097455:web:64b281c6c5f227b557de9a"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };*/

// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, query, where, updateDoc, doc, getDocs } from "firebase/firestore";
import { getFunctions } from "firebase/functions";
//import { signInWithEmailAndPassword } from "firebase/auth";
import { getStorage } from 'firebase/storage';


const firebaseConfig = {
  apiKey: "AIzaSyBWxb_ygDJHmHrIR7IT4PAqwgBQXZtGz7A",
  authDomain: "lcms-d908d.firebaseapp.com",
  projectId: "lcms-d908d",
  storageBucket: "lcms-d908d.appspot.com",
  messagingSenderId: "806407007684",
  appId: "1:806407007684:web:66cf795b10a96ecc77c891"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const functions = getFunctions(app)
const storage = getStorage(app);

export { auth, db, collection, query, where, updateDoc, doc, getDocs, functions, storage }; // Export necessary Firestore functions

// Function to update complaint status as picked
export const markComplaintAsPicked = async (complaintId) => {
  try {
    const complaintRef = doc(db, 'complaints', complaintId);
    await updateDoc(complaintRef, {
      picked: true
    });
    return true; // Optionally return true or handle success
  } catch (error) {
    console.error("Error updating document: ", error);
    return false; // Optionally return false or handle error
  }
};

// Function to fetch Complaint based on artisan's role
export const fetchComplaintsByRole = async (artisanRole) => {
  try {
    const complaintsRef = collection(db, 'complaints');
    const q = query(complaintsRef, where('type', '==', artisanRole));
    const snapshot = await getDocs(q);
    const complaintsData = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    return complaintsData;
  } catch (error) {
    console.error("Error fetching complaints: ", error);
    return []; // Optionally return empty array or handle error
  }
};



/*const testAdminSignIn = async () => {
  try {
    const adminEmail = "admin@gmail.com"; // Replace with your admin email
    const adminPassword = "admin123456"; // Replace with your admin password

    const userCredential = await signInWithEmailAndPassword(auth, adminEmail, adminPassword);
    console.log("Admin signed in:", userCredential.user);
  } catch (error) {
    console.error("Error signing in admin: ", error);
  }
};

testAdminSignIn();*/

