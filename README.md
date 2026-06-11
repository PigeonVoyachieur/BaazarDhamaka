# 🪔 Bazaar Dhamaka

Webapp e-commerce parodique **« TOUT À -97% »**, construite avec **TanStack Start (React + TanStack Router + SSR)**, **Tailwind CSS v4** et **framer-motion**, connectée à **Firebase Firestore**.

Les produits ne sont **pas en dur** : ils sont stockés dans Firestore et chargés via les *loaders* des routes. On peut donc en ajouter à tout moment sans toucher au code.

## ✨ Fonctionnalités

- Page **Accueil** (hero animé, catégories, best-sellers, avis, newsletter, pop-up d'urgence)
- Pages catégories : **Technologie**, **Jeux Vidéo**, **Vêtements**
- Catalogue chargé depuis **Firestore** (collection `products`)
- Rendu serveur (SSR) via TanStack Start
- Design fidèle à la maquette (thème festif saffron / vert / bollywood)

## 🚀 Démarrage

```bash
# 1. Installer les dépendances
npm install

# 2. Remplir la base Firestore avec le catalogue initial
npm run seed

# 3. Lancer le serveur de dev
npm run dev
```

L'app démarre sur http://localhost:5173 (ou le port libre suivant).

## 🔥 Firebase / Firestore

La configuration se trouve dans `src/lib/firebase.ts`.

⚠️ Avant `npm run seed`, ouvre les règles Firestore (sinon `PERMISSION_DENIED`).
Le fichier `firestore.rules` fournit une configuration de test (lecture/écriture
ouvertes) à publier depuis la console Firebase ou la CLI :

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /products/{product} {
      allow read: if true;
      allow write: if true;
    }
  }
}
```

> Tant que les règles ne sont pas ouvertes, le site s'affiche quand même mais les
> grilles de produits restent vides (les loaders renvoient une liste vide).

### Structure d'un document `products`

```ts
{
  name: "iPhonne 47 Pro Max Ultra",
  emoji: "📱",
  price: 49,
  original: 1299,               // prix barré
  rating: 4.9,                  // note sur 5
  reviews: 12847,
  tagline: "Compatible avec 1 chargeur (vendu séparément)",
  badge: "TOP CHOICE BHAI",     // optionnel
  category: "technologie",      // "technologie" | "jeux-video" | "vetement"
  order: 1                      // ordre d'affichage (best-sellers = 8 premiers)
}
```

## ➕ Ajouter un produit

1. **Console Firebase** → Firestore → collection `products` → ajouter un document.
2. **Modifier `scripts/seed.js`** puis relancer `npm run seed` (idempotent).
3. Via le SDK (`addDoc` / `setDoc`).

Le champ `category` détermine sur quelle page le produit apparaît.

## 🗂️ Structure du projet

```
src/
├── components/      SiteHeader · SiteFooter · MarqueeBar · ProductCard · CategoryHero · FakeUrgencyPopup
├── data/            products.ts (type Product + fetchers Firestore)
├── lib/             firebase.ts · utils.ts · gestion d'erreurs
├── routes/          __root.tsx · index.tsx · technologie.tsx · jeux-video.tsx · vetement.tsx
├── router.tsx       configuration du routeur
├── routeTree.gen.ts arbre de routes (généré)
├── server.ts        entrée serveur SSR
├── start.ts         middleware global
└── styles.css       thème Tailwind v4
scripts/
└── seed.js          remplissage initial de Firestore
```

> Site parodique. Aucun samosa n'a été blessé. 🥟
