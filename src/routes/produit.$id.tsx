import { useState } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { FakeUrgencyPopup } from "@/components/FakeUrgencyPopup";
import { CATEGORIES, fetchProductById } from "@/data/products";
import { useCart } from "@/lib/cart";
import { getReviews } from "@/lib/reviews";

export const Route = createFileRoute("/produit/$id")({
  head: () => ({
    meta: [
      { title: "Article — Bazaar Dhamaka" },
      { name: "description", content: "Découvrez cet article d'exception (ou pas) en grand format." },
    ],
  }),
  loader: async ({ params }) => {
    const product = await fetchProductById(params.id);
    if (!product) throw notFound();
    return product;
  },
  component: ProductPage,
  notFoundComponent: ProductNotFound,
});

function ProductNotFound() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <section className="mx-auto max-w-3xl px-4 py-24 text-center">
        <div className="text-6xl mb-4">🫥</div>
        <h1 className="font-display text-4xl text-ashoka">ARTICLE INTROUVABLE</h1>
        <p className="mt-3 text-muted-foreground italic">
          Cet article a peut-être été vendu 12 millions de fois (ou n'a jamais existé).
        </p>
        <Link
          to="/"
          className="peep-btn mt-6 inline-block rounded-md bg-bollywood text-white border-2 border-foreground px-6 py-3 font-display"
        >
          RETOUR À L'ACCUEIL
        </Link>
      </section>
      <SiteFooter />
    </div>
  );
}

function ProductPage() {
  const p = Route.useLoaderData();
  const { add } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const hasDiscount = p.original != null && p.original > p.price;
  const discount = hasDiscount
    ? Math.round(((p.original! - p.price) / p.original!) * 100)
    : 0;
  const rating = p.rating ?? 5;
  const reviews = p.reviews ?? 0;
  const categoryLabel =
    CATEGORIES.find((c) => c.slug === p.category)?.label ?? p.category;
  const customerReviews = getReviews(p.id, 10);

  function handleAdd() {
    add(p, qty);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1500);
  }

  return (
    <div className="min-h-screen">
      <SiteHeader />

      <section className="mx-auto max-w-6xl px-4 py-8">
        {/* Fil d'Ariane */}
        <nav className="mb-6 flex flex-wrap items-center gap-2 text-xs font-display text-muted-foreground">
          <Link to="/" className="hover:text-bollywood">ACCUEIL</Link>
          <span>›</span>
          <Link
            to={`/${p.category}`}
            className="hover:text-bollywood uppercase"
          >
            {categoryLabel}
          </Link>
          <span>›</span>
          <span className="text-foreground line-clamp-1">{p.name}</span>
        </nav>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* IMAGE EN GRAND */}
          <div className="product-card-decor relative">
            <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-2xl border-2 border-foreground bg-gradient-to-br from-saffron/30 via-cream to-india-green/30 text-[10rem] shadow-[8px_8px_0_0_var(--ashoka)]">
              {p.image ? (
                <img
                  src={p.image}
                  alt={p.name}
                  className="h-full w-full object-contain p-4"
                />
              ) : (
                <span className="float">{p.emoji ?? "📦"}</span>
              )}
              {hasDiscount && (
                <span className="absolute top-3 left-3 rounded-md bg-destructive px-3 py-1 text-sm font-bold text-destructive-foreground font-display">
                  -{discount}%
                </span>
              )}
              {p.badge && (
                <div className="dhamaka-badge absolute top-3 right-3 text-xs">{p.badge}</div>
              )}
            </div>
          </div>

          {/* CARACTÉRISTIQUES */}
          <div>
            <div className="dhamaka-badge inline-block mb-3 text-xs uppercase">
              {categoryLabel}
            </div>
            <h1 className="font-display text-3xl md:text-4xl text-ashoka leading-tight">
              {p.name}
            </h1>

            <div className="mt-3 flex items-center gap-2 text-sm">
              <span className="text-saffron text-lg">{"★".repeat(Math.round(rating))}</span>
              <span className="text-muted-foreground">
                {rating.toFixed(1)} / 5 — {reviews.toLocaleString("fr")} avis (tous vérifiés par notre cousin)
              </span>
            </div>

            <p className="mt-4 text-base italic text-foreground/80">{p.tagline}</p>

            <div className="mt-6 flex items-baseline gap-3">
              <span className="font-display text-5xl text-india-green">{p.price}€</span>
              {hasDiscount && (
                <>
                  <span className="text-lg text-muted-foreground line-through">{p.original}€</span>
                  <span className="rounded-md bg-destructive px-2 py-0.5 text-xs font-bold text-destructive-foreground font-display">
                    ÉCONOMISEZ {p.original! - p.price}€
                  </span>
                </>
              )}
            </div>

            {/* Caractéristiques parodiques */}
            <ul className="mt-6 grid grid-cols-2 gap-3 text-sm">
              {[
                { k: "Garantie", v: "12 minutes" },
                { k: "Livraison", v: "47 jours (moyenne)" },
                { k: "État", v: "Neuf-ish" },
                { k: "Retour", v: "Interdit*" },
              ].map((f) => (
                <li
                  key={f.k}
                  className="rounded-lg border-2 border-foreground bg-card px-3 py-2 shadow-[3px_3px_0_0_var(--saffron)]"
                >
                  <div className="font-display text-[11px] text-ashoka">{f.k}</div>
                  <div className="text-foreground">{f.v}</div>
                </li>
              ))}
            </ul>

            {/* Sélecteur de quantité + ajout */}
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <div className="flex items-center rounded-md border-2 border-foreground bg-card">
                <button
                  type="button"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="px-4 py-2 font-display text-lg hover:bg-saffron/40"
                  aria-label="Diminuer la quantité"
                >
                  −
                </button>
                <span className="w-10 text-center font-display">{qty}</span>
                <button
                  type="button"
                  onClick={() => setQty((q) => q + 1)}
                  className="px-4 py-2 font-display text-lg hover:bg-saffron/40"
                  aria-label="Augmenter la quantité"
                >
                  +
                </button>
              </div>

              <button
                type="button"
                onClick={handleAdd}
                className="peep-btn flex-1 min-w-[180px] rounded-md bg-saffron py-3 font-display text-foreground border-2 border-foreground hover:bg-bollywood hover:text-white transition-colors"
              >
                {added ? "AJOUTÉ AU PANIER ✓" : "AJOUTER AU PANIER 🛒"}
              </button>

              <Link
                to="/panier"
                className="rounded-md border-2 border-foreground bg-bollywood px-5 py-3 font-display text-white hover:bg-ashoka transition-colors"
              >
                VOIR LE PANIER →
              </Link>
            </div>

            <p className="mt-4 text-[11px] text-muted-foreground">
              *Les retours sont interdits car nous y croyons très fort.
            </p>
          </div>
        </div>

        {/* AVIS CLIENTS */}
        <div className="mt-16">
          <div className="flex flex-wrap items-end justify-between gap-3 mb-6">
            <h2 className="font-display text-3xl text-ashoka">
              AVIS <span className="text-bollywood">CLIENTS</span>
            </h2>
            <div className="text-sm text-muted-foreground italic">
              {reviews.toLocaleString("fr")} avis — tous vérifiés par notre cousin
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {customerReviews.map((r) => (
              <div
                key={r.id}
                className="rounded-xl border-2 border-foreground bg-card p-5 shadow-[4px_4px_0_0_var(--saffron)]"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-foreground bg-saffron/40 font-display text-sm">
                      {r.author.charAt(0)}
                    </span>
                    <div>
                      <div className="font-display text-sm text-foreground">{r.author}</div>
                      <div className="text-[11px] text-muted-foreground">{r.date}</div>
                    </div>
                  </div>
                  {r.verified && (
                    <span className="shrink-0 rounded-full bg-india-green/20 px-2 py-0.5 text-[10px] font-display text-india-green border border-india-green/40">
                      ✓ ACHAT VÉRIFIÉ
                    </span>
                  )}
                </div>
                <div className="mt-3 text-saffron">
                  {"★".repeat(r.stars)}
                  <span className="text-muted-foreground">{"★".repeat(5 - r.stars)}</span>
                </div>
                <div className="mt-1 font-display text-sm text-ashoka">{r.title}</div>
                <p className="mt-1 text-sm text-foreground/80">{r.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SiteFooter />
      <FakeUrgencyPopup />
    </div>
  );
}
