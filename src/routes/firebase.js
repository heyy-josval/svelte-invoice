import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
    apiKey: "AIzaSyDuRliFRLWaxoMlmRfdcEPZCHa2gC8btiA",
    authDomain: "bdd2-facturacion.firebaseapp.com",
    projectId: "bdd2-facturacion",
    storageBucket: "bdd2-facturacion.appspot.com",
    messagingSenderId: "413157643430",
    appId: "1:413157643430:web:73665ed8de1dfed89b9067"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app)
