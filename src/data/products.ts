import {
  collection,
  getDocs,
  getDoc,
  doc,
  query,
  where,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export const CATEGORIES = [
  { slug: "technologie", label: "Technologie" },
  { slug: "jeux-video", label: "Jeux Vidéo" },
  { slug: "vetement", label: "Vêtements" },
  { slug: "nourriture", label: "Nourriture" },
] as const;

export type CategorySlug = (typeof CATEGORIES)[number]["slug"];

export type Product = {
  id: string;
  name: string;
  /** Image du produit (URL). Si absente, on affiche l'emoji. */
  image?: string;
  emoji?: string;
  price: number;
  /** Prix barré (optionnel). */
  original?: number;
  rating?: number;
  reviews?: number;
  /** Description courte affichée sur la carte. */
  tagline: string;
  badge?: string;
  category: CategorySlug;
  /** Ordre d'affichage (optionnel) pour reproduire l'ordre des best-sellers. */
  order?: number;
};

/** Données saisies depuis le formulaire d'ajout sur le site. */
export type NewProduct = {
  name: string;
  image?: string;
  emoji?: string;
  price: number;
  original?: number;
  tagline: string;
  badge?: string;
  category: CategorySlug;
};

const COLLECTION = "products";

function mapDoc(d: { id: string; data: () => Record<string, unknown> }): Product {
  return { id: d.id, ...(d.data() as Omit<Product, "id">) };
}

function byOrder(a: Product, b: Product) {
  return (a.order ?? 9999) - (b.order ?? 9999);
}

/** Récupère tous les produits depuis Firestore (triés par `order`). */
export async function fetchProducts(): Promise<Product[]> {
  try {
    const snap = await getDocs(collection(db, COLLECTION));
    return snap.docs.map(mapDoc).sort(byOrder);
  } catch (err) {
    console.error("[products] fetchProducts a échoué :", err);
    return [];
  }
}

/** Récupère un seul produit par son identifiant Firestore. */
export async function fetchProductById(id: string): Promise<Product | null> {
  try {
    const snap = await getDoc(doc(db, COLLECTION, id));
    if (!snap.exists()) return null;
    return mapDoc(snap);
  } catch (err) {
    console.error(`[products] fetchProductById(${id}) a échoué :`, err);
    return null;
  }
}

/** Récupère les produits d'une catégorie donnée. */
export async function fetchByCategory(cat: CategorySlug): Promise<Product[]> {
  try {
    const snap = await getDocs(
      query(collection(db, COLLECTION), where("category", "==", cat))
    );
    return snap.docs.map(mapDoc).sort(byOrder);
  } catch (err) {
    console.error(`[products] fetchByCategory(${cat}) a échoué :`, err);
    return [];
  }
}

/**
 * Ajoute un produit dans Firestore depuis le formulaire du site.
 * Une note et un nombre d'avis plausibles sont générés pour coller à la maquette.
 */
export async function addProduct(input: NewProduct): Promise<string> {
  const rating = Math.round((4 + Math.random()) * 10) / 10; // 4.0 → 5.0
  const reviews = Math.floor(Math.random() * 19000) + 100;

  const payload: Omit<Product, "id"> = {
    name: input.name.trim(),
    tagline: input.tagline.trim(),
    price: input.price,
    category: input.category,
    rating,
    reviews,
    order: Date.now(),
  };
  if (input.image?.trim()) payload.image = input.image.trim();
  if (input.emoji?.trim()) payload.emoji = input.emoji.trim();
  if (input.original != null && input.original > input.price)
    payload.original = input.original;
  if (input.badge?.trim()) payload.badge = input.badge.trim();

  const ref = await addDoc(collection(db, COLLECTION), payload);
  return ref.id;
}

/** Ligne d'une commande (article + quantité). */
export type OrderLine = {
  productId: string;
  name: string;
  price: number;
  qty: number;
};

/** Informations client saisies au moment de commander. */
export type OrderCustomer = {
  name: string;
  email: string;
  address: string;
};

/**
 * Enregistre une commande dans Firestore (collection `orders`) et renvoie son id.
 */
export async function createOrder(
  customer: OrderCustomer,
  lines: OrderLine[]
): Promise<string> {
  const total = lines.reduce((s, l) => s + l.price * l.qty, 0);
  const payload = {
    customer: {
      name: customer.name.trim(),
      email: customer.email.trim(),
      address: customer.address.trim(),
    },
    lines,
    total,
    itemCount: lines.reduce((n, l) => n + l.qty, 0),
    status: "pending" as const,
    createdAt: serverTimestamp(),
  };
  const ref = await addDoc(collection(db, "orders"), payload);
  return ref.id;
}
