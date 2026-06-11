import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDwFNuk_ev_QVvcoCzLX_Kl10s7y1Jhq84",
  authDomain: "baazardhamaka.firebaseapp.com",
  projectId: "baazardhamaka",
  storageBucket: "baazardhamaka.firebasestorage.app",
  messagingSenderId: "731210205240",
  appId: "1:731210205240:web:fa2e8e9a5e497a94897ecd",
};

// Évite la double initialisation (HMR / SSR).
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const db = getFirestore(app);
export default app;
