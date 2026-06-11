/**
 * Remplit la collection `products` de Firestore avec le catalogue initial.
 *
 * Usage :  npm run seed
 *
 * Le script utilise le SDK client Firebase. Les règles Firestore doivent
 * autoriser l'écriture pendant le seed (voir firestore.rules).
 *
 * Schéma d'un document (identique au type `Product` du front) :
 *   { name, emoji, price, original, rating, reviews, tagline, badge?, category, order }
 *   category ∈ "technologie" | "jeux-video" | "vetement"
 */
import { initializeApp } from "firebase/app";
import { getFirestore, collection, doc, setDoc } from "firebase/firestore";

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

const products = [
  // === TECHNOLOGIE ===
  { id: "t1", name: "iPhonne 47 Pro Max Ultra", emoji: "📱", price: 49, original: 1299, rating: 4.9, reviews: 12847, tagline: "Compatible avec 1 chargeur (vendu séparément)", badge: "TOP CHOICE BHAI", category: "technologie" },
  { id: "t2", name: "Écouteurs Sans Fil (Avec Fil)", emoji: "🎧", price: 7, original: 199, rating: 4.2, reviews: 8421, tagline: "Bluetooth 0.1 — portée 12 cm", category: "technologie" },
  { id: "t3", name: "PC Gamer 8 Cœurs (De Pomme)", emoji: "💻", price: 89, original: 2499, rating: 4.7, reviews: 3211, tagline: "RGB inclus, ordinateur en option", badge: "MEGA DHAMAKA", category: "technologie" },
  { id: "t4", name: "Chargeur Universel*", emoji: "🔌", price: 3, original: 49, rating: 3.8, reviews: 19022, tagline: "*Sauf votre prise", category: "technologie" },
  { id: "t5", name: "Smartwatch Apel Watch 12", emoji: "⌚", price: 12, original: 599, rating: 4.5, reviews: 5102, tagline: "Donne l'heure (parfois)", category: "technologie" },
  { id: "t6", name: "Drone Caméra 8K HDR 360°", emoji: "🛸", price: 19, original: 899, rating: 4.1, reviews: 2204, tagline: "Vole jusqu'à 2 mètres", category: "technologie" },
  { id: "t7", name: "Enceinte Boombix Mini", emoji: "🔊", price: 5, original: 149, rating: 4.6, reviews: 6701, tagline: "Son surround mono", badge: "HOT 🔥", category: "technologie" },
  { id: "t8", name: "Robot Aspirateur Roumba", emoji: "🤖", price: 22, original: 499, rating: 4.0, reviews: 1102, tagline: "Aspire surtout votre patience", category: "technologie" },

  // === JEUX VIDEO ===
  { id: "j1", name: "PleyStation 6 Slim Pro", emoji: "🎮", price: 39, original: 899, rating: 4.8, reviews: 22014, tagline: "Lit aussi les disques Blu-Ray (rayés)", badge: "NEXT-GEN 2009", category: "jeux-video" },
  { id: "j2", name: "Xbox Series Z", emoji: "🕹️", price: 35, original: 799, rating: 4.6, reviews: 14201, tagline: "Le Z signifie Zéro garantie", category: "jeux-video" },
  { id: "j3", name: "Nintendo Switcher OLED", emoji: "🎴", price: 28, original: 359, rating: 4.7, reviews: 9912, tagline: "Switch entre marche et arrêt", badge: "TOP CHOICE BHAI", category: "jeux-video" },
  { id: "j4", name: "Mario Cart Deluxxxe", emoji: "🏎️", price: 4, original: 69, rating: 4.4, reviews: 7811, tagline: "Avec Luigui et Princeze Pesh", category: "jeux-video" },
  { id: "j5", name: "Manette Tactile Sans Boutons", emoji: "🎛️", price: 9, original: 89, rating: 3.9, reviews: 1432, tagline: "Innovation révolutionnaire", category: "jeux-video" },
  { id: "j6", name: "Casque VR Carton 3D", emoji: "🥽", price: 6, original: 299, rating: 4.3, reviews: 4521, tagline: "Smartphone non inclus, ni recommandé", category: "jeux-video" },
  { id: "j7", name: "Souris Gaming RGB 99000 DPI", emoji: "🖱️", price: 3, original: 79, rating: 4.5, reviews: 12044, tagline: "Tellement rapide qu'elle vous fuit", badge: "DHAMAKA", category: "jeux-video" },
  { id: "j8", name: "FIFA 47 Edition Bollywood", emoji: "⚽", price: 5, original: 79, rating: 4.6, reviews: 8821, tagline: "Cricket mode débloqué", category: "jeux-video" },

  // === VETEMENT ===
  { id: "v1", name: "T-Shirt Adibas Original", emoji: "👕", price: 3, original: 49, rating: 4.4, reviews: 18211, tagline: "3 bandes (ou 4 ou 2)", badge: "BEST SELLER", category: "vetement" },
  { id: "v2", name: "Sneakers Mike Air Max", emoji: "👟", price: 8, original: 189, rating: 4.5, reviews: 12044, tagline: "Le swoosh est dans l'autre sens", category: "vetement" },
  { id: "v3", name: "Veste Cuir Vegan (Plastique)", emoji: "🧥", price: 12, original: 299, rating: 4.1, reviews: 3421, tagline: "Imperméable à la pluie et au confort", category: "vetement" },
  { id: "v4", name: "Sari Fast-Fashion Glitter", emoji: "👗", price: 9, original: 159, rating: 4.7, reviews: 6701, tagline: "Bollywood vibes — paillettes incluses", badge: "DHAMAKA", category: "vetement" },
  { id: "v5", name: "Casquette Guuci Authentique®", emoji: "🧢", price: 4, original: 89, rating: 4.2, reviews: 9211, tagline: "® = Réplique Évidente", category: "vetement" },
  { id: "v6", name: "Jean Levee's 501 Skinny Bootcut", emoji: "👖", price: 7, original: 119, rating: 4.0, reviews: 5401, tagline: "Tailles XS / S / M / L / XXXXXL", category: "vetement" },
  { id: "v7", name: "Lunettes Ray-Bun Aviator", emoji: "🕶️", price: 2, original: 159, rating: 4.3, reviews: 14021, tagline: "Protection UV non garantie", category: "vetement" },
  { id: "v8", name: "Sac à Main Louis Vitton", emoji: "👜", price: 11, original: 1899, rating: 4.6, reviews: 7701, tagline: "Monograme légèrement déformé", badge: "LUXE", category: "vetement" },
];

async function seed() {
  console.log(`🌱 Seed de ${products.length} produits dans Firestore…`);
  const col = collection(db, "products");

  for (let i = 0; i < products.length; i++) {
    const { id, ...data } = products[i];
    // `order` conserve l'ordre du catalogue (best-sellers = 8 premiers).
    await setDoc(doc(col, id), { ...data, order: i + 1 });
    console.log(`  ✓ ${data.category.padEnd(12)} ${data.name}`);
  }

  console.log("✅ Seed terminé ! Idempotent : relançable sans créer de doublon.");
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Erreur pendant le seed :", err);
  process.exit(1);
});
