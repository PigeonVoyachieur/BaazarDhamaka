export type Review = {
  id: string;
  author: string;
  stars: number;
  date: string;
  title: string;
  text: string;
  verified: boolean;
};

/** Hash déterministe d'une chaîne (FNV-1a 32 bits). */
function hashString(str: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

/** Générateur pseudo-aléatoire déterministe (mulberry32). */
function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const AUTHORS = [
  "Kévin R.", "Sophie L.", "Mehdi B.", "Anjali P.", "Jean-Claude D.",
  "Fatou N.", "Raj P.", "Brigitte M.", "Dylan T.", "Priya S.",
  "Gérard X.", "Aïcha K.", "Bryan F.", "Sandrine V.", "Mamadou C.",
  "Jessica W.", "Thierry B.", "Lakshmi R.", "Cédric H.", "Nadia Z.",
];

const TITLES = [
  "Incroyable bhai !", "Bof mais bon…", "Arnaque (mais j'adore)", "5 étoiles forcé",
  "Reçu en 47 jours", "Mon cousin valide", "Ça a explosé", "Très très très bien",
  "Conforme à l'arnaque", "Je recommande (ou pas)", "Wallah c'est validé", "Top qualité prix",
  "Surpris (en mal)", "Meilleur achat de ma vie", "Mitigé mais content",
];

const TEXTS = [
  "Livré en seulement 89 jours, super rapide ! L'emballage sentait le curry, gros bonus.",
  "Le produit a tenu 12 minutes pile, comme la garantie. Service client = un pigeon. 5 étoiles.",
  "Mon mari a pleuré en l'ouvrant. De joie ou de regret, je ne sais pas. On garde.",
  "C'est exactement ce que je n'avais pas commandé, mais bizarrement je suis content.",
  "Photo trompeuse mais l'arnaque est honnête. Je respecte. Re-commande direct.",
  "Ça a pris feu mais joliment 🔥. Très esthétique. Recommandé à toute la famille.",
  "Reçu cassé, recollé avec du chai, fonctionne mieux qu'avant. Magie indienne.",
  "Le vendeur m'a appelé « bhai » 47 fois, je me suis senti en famille. 10/10.",
  "Qualité « goodish, probably ». Pour le prix on va pas se plaindre hein.",
  "J'ai voulu retourner l'article mais les retours sont interdits. Du coup j'assume.",
  "Mon chat l'a adopté. Il dort dessus. Donc utile au final.",
  "Annoncé -97%, payé plein pot, mais l'émotion était à -97% aussi. Équilibré.",
  "Le colis est arrivé tiède. Comme promis. On ne peut rien leur reprocher.",
  "Très satisfait, sauf que ça ne marche pas. Sinon nickel. Bisous bhai.",
  "Code promo ARRE69 appliqué, j'ai économisé 0,02€. La fortune. Merci.",
  "Marche une fois sur deux, mais quelle fois ! Vibrant. Inattendu. Légendaire.",
  "Mon voisin est jaloux. Mission accomplie. Le reste on s'en fiche un peu.",
  "Emballage premium (du papier journal de 2009). Vintage. J'adore le détail.",
];

/**
 * Génère une liste d'avis (~`count`) déterministes pour un produit donné.
 * Le même `productId` produit toujours les mêmes avis (stables entre les rendus).
 */
export function getReviews(productId: string, count = 10): Review[] {
  const rand = mulberry32(hashString(productId));
  const pick = <T,>(arr: T[]) => arr[Math.floor(rand() * arr.length)];
  const used = new Set<string>();
  const reviews: Review[] = [];

  for (let i = 0; i < count; i++) {
    // 70% de 5★, 20% de 4★, 10% en dessous (parodie de « tous vérifiés »).
    const roll = rand();
    const stars = roll < 0.7 ? 5 : roll < 0.9 ? 4 : 1 + Math.floor(rand() * 3);

    let author = pick(AUTHORS);
    let guard = 0;
    while (used.has(author) && guard++ < 10) author = pick(AUTHORS);
    used.add(author);

    const daysAgo = 1 + Math.floor(rand() * 400);
    const date = new Date(Date.now() - daysAgo * 86400000);

    reviews.push({
      id: `${productId}-r${i}`,
      author,
      stars,
      date: date.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" }),
      title: pick(TITLES),
      text: pick(TEXTS),
      verified: rand() > 0.25,
    });
  }

  return reviews;
}

/** Moyenne arrondie à une décimale d'une liste d'avis. */
export function averageStars(reviews: Review[]): number {
  if (reviews.length === 0) return 0;
  return Math.round((reviews.reduce((s, r) => s + r.stars, 0) / reviews.length) * 10) / 10;
}
