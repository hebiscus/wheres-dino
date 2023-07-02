import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDg4B3ey7iw1G9gmkoETE40nrwPwYryxjI",
  authDomain: "wheres-waldo-f9572.firebaseapp.com",
  projectId: "wheres-waldo-f9572",
  storageBucket: "wheres-waldo-f9572.appspot.com",
  messagingSenderId: "670190585253",
  appId: "1:670190585253:web:b6e950558f0282799ad44c"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);