import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { FakeUrgencyPopup } from "@/components/FakeUrgencyPopup";
import { ProductCard } from "@/components/ProductCard";
import { ProductCarousel } from "@/components/ProductCarousel";
import { fetchProducts } from "@/data/products";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Bazaar Dhamaka — Accueil | Mega Sale -97%" },
      { name: "description", content: "Découvrez les meilleurs deals parodiques d'Inde. Tech, gaming, mode." },
    ],
  }),
  // Les produits viennent de Firestore (plus de tableau en dur).
  loader: async () => {
    const products = await fetchProducts();
    const bestSellers = products.slice(0, 8);
    // Le carousel met en avant d'AUTRES articles que les best-sellers.
    const bestIds = new Set(bestSellers.map((p) => p.id));
    const featured = products.filter((p) => !bestIds.has(p.id)).slice(0, 12);
    return { bestSellers, featured };
  },
  component: Index,
});

const CATEGORIES = [
  { to: "/technologie", title: "Technologie", emoji: "📱", tag: "Pointe de 2009", bg: "bg-india-green" },
  { to: "/jeux-video", title: "Jeux Vidéo", emoji: "🎮", tag: "Next-gen précédente", bg: "bg-saffron" },
  { to: "/vetement", title: "Vêtements", emoji: "👗", tag: "Bollywood approved", bg: "bg-bollywood" },
  { to: "/nourriture", title: "Nourriture", emoji: "🍛", tag: "Chaîne du froid rompue", bg: "bg-india-green" },
] as const;

const TESTIMONIALS = [
  { name: "Kévin R.", text: "5 étoiles, le téléphone a explosé mais joliment 🔥", stars: 5 },
  { name: "Sophie L.", text: "Livré en seulement 89 jours, super rapide bhai !", stars: 5 },
  { name: "Mehdi B.", text: "Le sari est devenu un mouchoir au lavage. Top.", stars: 4 },
  { name: "Anjali P.", text: "La manette tactile sans boutons est révolutionnaire.", stars: 5 },
];

function Index() {
  const { bestSellers, featured } = Route.useLoaderData();
  return (
    <div className="min-h-screen">
      <SiteHeader />

      <section className="relative overflow-hidden border-b-2 border-foreground bg-gradient-to-br from-saffron via-cream to-india-green">
        <div className="absolute inset-0 pointer-events-none">
          <div className="drive absolute bottom-6 text-5xl">🛺</div>
          <motion.div
            animate={{ y: [0, -20, 0], rotate: [0, 10, -10, 0] }}
            transition={{ duration: 5, repeat: Infinity }}
            className="absolute top-10 right-10 text-6xl"
          >🪔</motion.div>
          <motion.div
            animate={{ y: [0, 15, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="absolute top-32 left-12 text-5xl"
          >🥟</motion.div>
          <motion.div
            animate={{ rotate: [0, -8, 8, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute bottom-24 right-24 text-5xl"
          >☕</motion.div>
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-20 md:py-28 text-center">
          <div className="dhamaka-badge inline-block mb-6 text-base">MEGA DHAMAKA SALE 🪔</div>
          <h1 className="font-display text-5xl md:text-8xl text-ashoka leading-none">
            TOUT À <span className="text-bollywood blink">-97%</span><br/>
            <span className="text-india-green">SAUF CE QUE</span><br/>
            <span className="text-saffron">VOUS VOULEZ VRAIMENT</span>
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-lg italic text-foreground/80">
            Le seul site où le prix barré est plus crédible que le prix réel.
            Livraison express en 47 jours (en moyenne).
          </p>
          <div className="mt-8 flex flex-wrap gap-3 justify-center">
            <Link to="/technologie" className="peep-btn rounded-md bg-foreground text-cream px-6 py-3 font-display border-2 border-foreground hover:bg-bollywood transition">
              SHOPPER MAINTENANT 🛒
            </Link>
            <button className="rounded-md bg-cream border-2 border-foreground px-6 py-3 font-display hover:bg-saffron transition">
              CODE PROMO : ARRE69
            </button>
          </div>
          <div className="mt-10 grid grid-cols-3 gap-4 max-w-xl mx-auto text-xs md:text-sm">
            {[
              { n: "47", l: "JOURS DE LIVRAISON" },
              { n: "12M+", l: "CLIENTS TROMPÉS" },
              { n: "0,4%", l: "TAUX DE RETOUR*" },
            ].map((s) => (
              <div key={s.l} className="rounded-lg border-2 border-foreground bg-card p-3">
                <div className="font-display text-2xl text-bollywood">{s.n}</div>
                <div className="text-muted-foreground">{s.l}</div>
              </div>
            ))}
          </div>
          <p className="mt-2 text-[10px] text-muted-foreground">*car les retours sont interdits</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16">
        <h2 className="font-display text-3xl md:text-5xl text-center mb-10 text-ashoka">
          NOS <span className="text-bollywood">CATÉGORIES</span> DHAMAKA
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {CATEGORIES.map((c) => (
            <Link
              key={c.to}
              to={c.to}
              className={`group relative overflow-hidden rounded-2xl border-2 border-foreground ${c.bg} p-8 shadow-[8px_8px_0_0_var(--ashoka)] hover:-translate-y-2 hover:rotate-1 transition-transform`}
            >
              <div className="text-8xl mb-4 group-hover:scale-110 transition">{c.emoji}</div>
              <h3 className="font-display text-3xl text-cream">{c.title}</h3>
              <p className="mt-2 text-cream/90 italic">{c.tag}</p>
              <div className="mt-4 inline-block font-display text-sm text-cream underline">EXPLORER →</div>
            </Link>
          ))}
        </div>
      </section>

      {featured.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-12">
          <div className="flex items-end justify-between mb-2">
            <h2 className="font-display text-3xl md:text-5xl text-ashoka">
              EN CE <span className="text-bollywood">MOMENT</span> 🎡
            </h2>
            <div className="hidden md:block text-sm text-muted-foreground italic">
              Faites défiler → (ça bouge tout seul aussi)
            </div>
          </div>
          <p className="mb-4 text-sm text-muted-foreground italic">
            Une sélection qui tourne en boucle, comme nos promesses de livraison.
          </p>
          <ProductCarousel items={featured} />
        </section>
      )}

      <section className="mx-auto max-w-7xl px-4 py-12">
        <div className="flex items-end justify-between mb-8">
          <h2 className="font-display text-3xl md:text-5xl text-ashoka">
            BEST-SELLERS <span className="text-bollywood">BHAI</span>
          </h2>
          <div className="hidden md:block text-sm text-muted-foreground italic">
            Mis à jour il y a 4 minutes (ou pas)
          </div>
        </div>
        {bestSellers.length === 0 ? (
          <p className="text-center text-muted-foreground italic py-10">
            Aucun produit pour l'instant. Lance <code>npm run seed</code> (et vérifie les règles Firestore).
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {bestSellers.map((p) => <ProductCard key={p.id} p={p} />)}
          </div>
        )}
      </section>

      <section className="bg-india-green/15 border-y-2 border-foreground py-16 mt-12">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="font-display text-3xl md:text-5xl text-center mb-10 text-ashoka">
            ILS NOUS <span className="text-bollywood">ADORENT</span>
          </h2>
          <div className="grid gap-6 md:grid-cols-4">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="rounded-xl border-2 border-foreground bg-card p-5 shadow-[4px_4px_0_0_var(--saffron)]">
                <div className="text-saffron text-lg">{"★".repeat(t.stars)}</div>
                <p className="mt-2 text-sm">"{t.text}"</p>
                <div className="mt-3 font-display text-xs text-ashoka">— {t.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-16 text-center">
        <div className="text-5xl mb-3">📨</div>
        <h2 className="font-display text-3xl text-ashoka">INSCRIVEZ-VOUS</h2>
        <p className="mt-2 text-muted-foreground italic">
          Recevez 47 emails par jour avec des offres dont vous ne voulez pas.
        </p>
        <div className="mt-6 flex gap-2 max-w-md mx-auto">
          <input className="flex-1 rounded-md border-2 border-foreground bg-card px-4 py-2 outline-none" placeholder="votre@email.com" />
          <button className="peep-btn rounded-md bg-bollywood text-white border-2 border-foreground px-5 py-2 font-display">OK BHAI</button>
        </div>
      </section>

      <SiteFooter />
      <FakeUrgencyPopup />
    </div>
  );
}
