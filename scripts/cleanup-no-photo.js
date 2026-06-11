/**
 * Supprime de Firestore tous les produits sans photo (champ `image` vide/absent).
 *
 * Usage :  node scripts/cleanup-no-photo.js
 *
 * Les règles d'écriture Firestore doivent être ouvertes (voir firestore.rules).
 */
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDwFNuk_ev_QVvcoCzLX_Kl10s7y1Jhq84",
  authDomain: "baazardhamaka.firebaseapp.com",
  projectId: "baazardhamaka",
  storageBucket: "baazardhamaka.firebasestorage.app",
  messagingSenderId: "731210205240",
  appId: "1:731210205240:web:fa2e8e9a5e497a94897ecd",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function cleanup() {
  const col = collection(db, "products");
  const snap = await getDocs(col);

  const toDelete = snap.docs.filter((d) => {
    const img = d.data().image;
    return typeof img !== "string" || img.trim() === "";
  });

  if (toDelete.length === 0) {
    console.log("✅ Aucun produit sans photo. Rien à supprimer.");
    process.exit(0);
  }

  console.log(`🗑️  Suppression de ${toDelete.length} produit(s) sans photo…`);
  for (const d of toDelete) {
    await deleteDoc(doc(col, d.id));
    console.log(`  ✓ supprimé : ${d.data().name ?? d.id}`);
  }

  console.log("✅ Nettoyage terminé.");
  process.exit(0);
}

cleanup().catch((err) => {
  console.error("❌ Erreur pendant le nettoyage :", err);
  process.exit(1);
});
