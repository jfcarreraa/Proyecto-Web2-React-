import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore" 
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getStorage} from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBuxjUdFYr7eybg8BrYvQCnvULvYHdzR0w",
  authDomain: "web-app-fc023.firebaseapp.com",
  projectId: "web-app-fc023",
  storageBucket: "web-app-fc023.appspot.com",
  messagingSenderId: "1073228764718",
  appId: "1:1073228764718:web:9b88c7755b65c1d2b571bf"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const storage = getStorage(app);

export { app, db, auth, googleProvider, storage };