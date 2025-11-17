// Import the functions you need from the SDKs you need
import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getFirestore, Firestore } from "firebase/firestore";
import { getAuth, Auth } from "firebase/auth";
import { getStorage, FirebaseStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC3dJcHoxfV-kvyRi5XjCDyEsjzDoc2bjM",
  authDomain: "arabiyat-5f5f0.firebaseapp.com",
  projectId: "arabiyat-5f5f0",
  storageBucket: "arabiyat-5f5f0.firebasestorage.app",
  messagingSenderId: "374476174162",
  appId: "1:374476174162:web:c356cd629d5f34e25b808b"
};

// Initialize Firebase
let app: FirebaseApp;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

// Initialize Firebase services
export const db: Firestore = getFirestore(app);
export const auth: Auth = getAuth(app);
export const storage: FirebaseStorage = getStorage(app);

export default app;

