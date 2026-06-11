import { useState } from "react";
import { Link } from "@tanstack/react-router";
import type { Product } from "@/data/products";
import { useCart } from "@/lib/cart";

export function ProductCard({ p }: { p: Product }) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);
  const hasDiscount = p.original != null && p.original > p.price;
  const discount = hasDiscount
    ? Math.round(((p.original! - p.price) / p.original!) * 100)
    : 0;
  const rating = p.rating ?? 5;
  const reviews = p.reviews ?? 0;
  const isPreview = p.id === "preview";

  function handleAdd() {
    add(p);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1200);
  }

  return (
    <div className="product-card-decor group relative">
      <div className="rounded-xl border-2 border-foreground bg-card p-4 shadow-[6px_6px_0_0_var(--ashoka)] transition-transform hover:-translate-y-1 hover:-rotate-1">
        <Link
          to={isPreview ? "/" : "/produit/$id"}
          params={isPreview ? undefined : { id: p.id }}
          disabled={isPreview}
          className="block"
        >
          <div className="relative mb-3 flex h-40 items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-saffron/30 via-cream to-india-green/30 text-7xl">
            {p.image ? (
              <img
                src={p.image}
                alt={p.name}
                loading="lazy"
                className="h-full w-full object-contain p-1 transition-transform group-hover:scale-105"
              />
            ) : (
              <span className="float">{p.emoji ?? "📦"}</span>
            )}
            {hasDiscount && (
              <span className="absolute top-1 left-1 rounded-md bg-destructive px-1.5 py-0.5 text-[10px] font-bold text-destructive-foreground font-display">
                -{discount}%
              </span>
            )}
          </div>
          {p.badge && (
            <div className="dhamaka-badge inline-block mb-2 text-xs">{p.badge}</div>
          )}
          <h3 className="font-display text-sm leading-tight text-foreground line-clamp-2 min-h-[36px] group-hover:text-bollywood transition-colors">
            {p.name}
          </h3>
          <p className="mt-1 text-xs italic text-muted-foreground line-clamp-2 min-h-[32px]">
            {p.tagline}
          </p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-display text-2xl text-india-green">{p.price}€</span>
            {hasDiscount && (
              <span className="text-xs text-muted-foreground line-through">{p.original}€</span>
            )}
          </div>
          <div className="mt-1 flex items-center gap-1 text-xs">
            <span className="text-saffron">{"★".repeat(Math.round(rating))}</span>
            <span className="text-muted-foreground">({reviews.toLocaleString("fr")})</span>
          </div>
        </Link>
        <button
          type="button"
          onClick={handleAdd}
          disabled={isPreview}
          className="peep-btn mt-3 w-full rounded-md bg-saffron py-2 font-display text-sm text-foreground hover:bg-bollywood hover:text-white transition-colors border-2 border-foreground disabled:opacity-60"
        >
          {added ? "AJOUTÉ ✓" : "AJOUTER AU PANIER 🛒"}
        </button>
      </div>
    </div>
  );
}
