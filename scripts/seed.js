/**
 * Remplit la collection `products` de Firestore avec le catalogue Bazaar Dhamaka.
 *
 * Usage :  npm run seed
 *
 * Les images sont servies depuis public/products/ (chemins en /products/...).
 * Les règles d'écriture Firestore doivent être ouvertes (voir firestore.rules).
 *
 * Schéma : { name, image, price, original, tagline, badge?, category, rating, reviews, order }
 *   category ∈ "technologie" | "jeux-video" | "vetement" | "nourriture"
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
  // ================= TECHNOLOGIE =================
  {
    id: "tech-iphonix10",
    name: "iPhonix 10 Ultra Max Lite",
    image: "/products/iphonix10.webp",
    price: 49,
    original: 1399,
    tagline:
      "« Almost revolutionary ». Écran Super Retina-ish 6,9\". Reconnaissance faciale : il vous voit (parfois).",
    badge: "BEST COPY 2026",
    category: "technologie",
    rating: 4.7,
    reviews: 13402,
  },
  {
    id: "tech-samfroung",
    name: "Samfroung Galaxy S30-ish",
    image: "/products/samfroung.webp",
    price: 44,
    original: 1299,
    tagline:
      "Pas tout à fait un flagship. Capteur 200MP mega-ish, performances « goodish, probably ». Tient peut-être une journée.",
    badge: "MEGA PROMO",
    category: "technologie",
    rating: 4.4,
    reviews: 9870,
  },
  {
    id: "tech-airbuds",
    name: "AirBuds Mono",
    image: "/products/airbuds.webp",
    price: 6,
    original: 199,
    tagline:
      "One bud. Endless focus. Un seul écouteur pour une concentration totale — le mode stéréo (et l'autre oreille) en option.",
    badge: "ALMOST STEREO",
    category: "technologie",
    rating: 4.1,
    reviews: 6701,
  },
  {
    id: "tech-appelpad",
    name: "AppelPad",
    image: "/products/appelpad.webp",
    price: 59,
    original: 1099,
    tagline:
      "« Because normal is overrated ». Conçu quelque part, assemblé ailleurs. Édition spéciale étudiants désargentés.",
    badge: "STUDENT DEAL",
    category: "technologie",
    rating: 4.3,
    reviews: 3120,
  },
  {
    id: "tech-iphony",
    name: "iPhony 14 Pro-ish",
    image: "/products/iphony.webp",
    price: 39,
    original: 1299,
    tagline:
      "« Not exactly a flagship. » Appareil photo 10 Trillion Px (tous non-fonctionnels, aucun réel). Écran pré-fissuré d'origine, « Made in China… mostly ».",
    badge: "ULTRA PROMO",
    category: "technologie",
    rating: 4.2,
    reviews: 7640,
  },
  {
    id: "tech-poirewatch",
    name: "Poire Watch-ish",
    image: "/products/watch.webp",
    price: 12,
    original: 449,
    tagline:
      "« Kinda Pro. Mostly just for show. » Batterie « meh » (1h), suivi santé « so-so » qui compte vaguement vos pas. Affiche fièrement ER:00.",
    badge: "ULTRA PROMO",
    category: "technologie",
    rating: 4.0,
    reviews: 3401,
  },
  {
    id: "tech-khenaid",
    name: "KhenAid Mélangeur Quantique",
    image: "/products/cuiseur.webp",
    price: 80,
    original: 699,
    tagline:
      "« Auto-cuisson par télépathie ! » Mélangeur à quantique, 9 vitesses imaginaires. Le mélangeur du futur : 100% Espoir, 0% Garantie. Pièces non fonctionnelles.",
    badge: "RÊVE D'UN CHEF",
    category: "technologie",
    rating: 4.3,
    reviews: 2118,
  },
  {
    id: "tech-punassonic",
    name: "PuNassonic CF-FZ2000",
    image: "/products/punassonic.webp",
    price: 29,
    original: 1999,
    tagline:
      "Le « Toughbook » increvable (sauf l'écran bleu permanent). Clavier AZERTY au marqueur, erreur 0xc000000f incluse d'usine. Made in China.",
    badge: "INDESTRUCTIBLE-ISH",
    category: "technologie",
    rating: 3.9,
    reviews: 1503,
  },

  // ================= JEUX VIDÉO =================
  {
    id: "jeu-poopsimulator",
    name: "Poop Simulator (Potty Station 5)",
    image: "/products/poopsimulator.webp",
    price: 9,
    original: 49,
    tagline:
      "« It's a crappy job… but someone's gotta do it. » N°1 du business du #2. Mode chasse d'eau et copains canards inclus.",
    badge: "100% FUNNY",
    category: "jeux-video",
    rating: 4.8,
    reviews: 18230,
  },
  {
    id: "jeu-gtavelo",
    name: "Grand Theft Vélo — Street Pedal Edition",
    image: "/products/gtavelo.webp",
    price: 22,
    original: 79,
    tagline:
      "Ride. Steal. Escape. Repeat. Pas de voiture ? Pas de problème. Vole des baguettes à vélo dans un Paris en monde ouvert.",
    badge: "OPEN-WORLD PARIS",
    category: "jeux-video",
    rating: 4.9,
    reviews: 22014,
  },
  {
    id: "jeu-callofcantine",
    name: "Call of Cantine — Ultimate Tray Edition",
    image: "/products/callofcantine.webp",
    price: 19,
    original: 79,
    tagline:
      "Survis. Mange. Diplôme-toi. Recommence. Bataille de plateaux 4 joueurs en coop dans le réfectoire (Cafeteria Chaos Engine).",
    badge: "LUNCH WARFARE",
    category: "jeux-video",
    rating: 4.6,
    reviews: 14201,
  },
  {
    id: "jeu-kitchensimulator",
    name: "Kitchen Simulator",
    image: "/products/kitchensimulator.webp",
    price: 17,
    original: 59,
    tagline:
      "Cook. Chaos. Repeat. Nouveau « Burn Mode » pour encore plus de catastrophes. DLC lave-vaisselle inclus (faut bien que quelqu'un nettoie).",
    badge: "BURN MODE",
    category: "jeux-video",
    rating: 4.5,
    reviews: 8821,
  },
  {
    id: "jeu-chooseyourwife",
    name: "Choose Your Wife",
    image: "/products/chooseyourwife.webp",
    price: 24,
    original: 69,
    tagline:
      "Une aventure de destin et de tradition. Choisis bien : il n'y a pas de bouton « recommencer ». PEGI 16.",
    category: "jeux-video",
    rating: 4.4,
    reviews: 5102,
  },
  {
    id: "jeu-groomsimulator",
    name: "Groom Simulator",
    image: "/products/groomsimulator.webp",
    price: 14,
    original: 59,
    tagline:
      "« Ready or not… here he comes! » Joue à Roblox au lieu d'aller à ton propre mariage. Mode belle-mère en approche.",
    category: "jeux-video",
    rating: 4.2,
    reviews: 2204,
  },
  {
    id: "jeu-icecream",
    name: "Ice Cream Seller (PS5)",
    image: "/products/icecream.webp",
    price: 21,
    original: 69,
    tagline:
      "« Une aventure sucrée en rue. » Vends des glaces artisanales à des enfants… qui ne reviendront jamais. Ambiance ruelle pavée. PEGI 16.",
    badge: "GLACE ARTISANALE",
    category: "jeux-video",
    rating: 4.6,
    reviews: 9112,
  },
  {
    id: "jeu-karen",
    name: "Karen: Tech Support Simulator (PS5)",
    image: "/products/karen.webp",
    price: 23,
    original: 69,
    tagline:
      "« RELAX, DON'T HIT HER. » Une aventure de patience et d'absurdité. Survis au support technique face à la manageuse en furie. Écran bleu garanti.",
    badge: "PATIENCE NIVEAU 0",
    category: "jeux-video",
    rating: 4.7,
    reviews: 12840,
  },

  // ================= VÊTEMENTS =================
  {
    id: "vet-jaipiscine",
    name: "T-Shirt « Je peux pas, j'ai piscine »",
    image: "/products/jaipiscine.webp",
    price: 13,
    original: 39,
    tagline:
      "« Je peux pas, j'ai piscine. *Sauf s'il y a des bières.* » L'excuse universelle, désormais sur ton torse.",
    badge: "BEST SELLER",
    category: "vetement",
    rating: 4.7,
    reviews: 12044,
  },
  {
    id: "vet-excuseme",
    name: "T-Shirt « Excuse Me Sir »",
    image: "/products/excuseme.webp",
    price: 14,
    original: 39,
    tagline:
      "« Excuse me sir — my body my choice. » Le t-shirt qui en impose, façon gros bonhomme de manga.",
    badge: "MY BODY MY CHOICE",
    category: "vetement",
    rating: 4.6,
    reviews: 8123,
  },
  {
    id: "vet-chaussette",
    name: "T-Shirt « La chaussette toute dure »",
    image: "/products/chaussette.webp",
    price: 12,
    original: 35,
    tagline:
      "« Mon fils, pourquoi la chaussette est toute dure ? » La grande question existentielle de toutes les mamans.",
    category: "vetement",
    rating: 4.5,
    reviews: 9211,
  },
  {
    id: "vet-mamie",
    name: "T-Shirt « Mamie dans les orties »",
    image: "/products/mamie.webp",
    price: 12,
    original: 35,
    tagline:
      "« J'ai pas poussé mamie dans les orties… mais elle a mangé le capot. » Le permis, c'est tellement surfait.",
    category: "vetement",
    rating: 4.4,
    reviews: 5401,
  },
  {
    id: "vet-dessusde10",
    name: "T-Shirt « Jamais au dessus de 10 »",
    image: "/products/dessusde10.webp",
    price: 12,
    original: 35,
    tagline:
      "« Jamais au dessus de 10… et je parle pas de vitesse. » La devise officielle des tortues et des sages.",
    badge: "TEAM TORTUE",
    category: "vetement",
    rating: 4.3,
    reviews: 4012,
  },
  {
    id: "vet-quartier",
    name: "T-Shirt « Bigrave au quartier »",
    image: "/products/quartier.webp",
    price: 12,
    original: 35,
    tagline:
      "« Je peux pas, je dois bigrave au quartier. » Les priorités, c'est sacré. Talkie-walkie non fourni.",
    category: "vetement",
    rating: 4.2,
    reviews: 3290,
  },
  {
    id: "vet-gitane",
    name: "T-Shirt « Heureuse comme une gitane »",
    image: "/products/gitane.webp",
    price: 12,
    original: 35,
    tagline:
      "« Heureuse comme une gitane entrain de voler du cuivre. » Cuivre collecté avec amour (et discrétion).",
    category: "vetement",
    rating: 4.1,
    reviews: 2456,
  },
  {
    id: "vet-coco",
    name: "T-Shirt « Fan N°1 de Coco.fr »",
    image: "/products/coco.webp",
    price: 11,
    original: 35,
    tagline:
      "« Je suis le fan number one de Coco.fr. » Affiche fièrement ta passion. Conversations garanties (ou pas).",
    category: "vetement",
    rating: 4.0,
    reviews: 1987,
  },

  // ================= NOURRITURE =================
  {
    id: "food-thali",
    name: "Thali de Rue « Comme à Delhi »",
    image: "/products/streetfood1.webp",
    price: 5,
    original: 22,
    tagline:
      "Curry, riz et naan légèrement carbonisé servis dans une assiette en métal pas tout à fait propre. Cuillère déjà utilisée offerte. Ambiance authentique garantie.",
    badge: "STREET FOOD",
    category: "nourriture",
    rating: 4.4,
    reviews: 5233,
  },
  {
    id: "food-bouillon",
    name: "Bouillon de Pattes Mystère",
    image: "/products/bouillon.webp",
    price: 7,
    original: 29,
    tagline:
      "Pattes de poulet, tripes et un « morceau » central non identifié. Mégot offert pour relever le fumet. Petits compagnons croustillants en option (gratuits).",
    badge: "RECETTE EXTRÊME",
    category: "nourriture",
    rating: 3.8,
    reviews: 3304,
  },
  {
    id: "food-ratmasala",
    name: "Masala Bhindi « Invités Surprise »",
    image: "/products/streetfoodrat.webp",
    price: 4,
    original: 19,
    tagline:
      "Curry d'okra mijoté avec quelques petits compagnons à poils. Protéines bonus 100% gratuites et (parfois) 100% vivantes. Très très local.",
    badge: "PROTÉINES BONUS",
    category: "nourriture",
    rating: 3.5,
    reviews: 1822,
  },
];

async function seed() {
  console.log(`🌱 Seed de ${products.length} produits dans Firestore…`);
  const col = collection(db, "products");

  for (let i = 0; i < products.length; i++) {
    const { id, ...data } = products[i];
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
