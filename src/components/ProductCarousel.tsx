import { useEffect, useRef } from "react";
import { ProductCard } from "./ProductCard";
import type { Product } from "@/data/products";

/**
 * Carousel horizontal d'articles avec flèches de navigation et défilement
 * automatique. Réutilise <ProductCard> pour chaque article.
 */
export function ProductCarousel({ items }: { items: Product[] }) {
  const trackRef = useRef<HTMLDivElement>(null);

  function scrollByCards(dir: 1 | -1) {
    const el = trackRef.current;
    if (!el) return;
    const amount = Math.max(280, el.clientWidth * 0.8);
    el.scrollBy({ left: dir * amount, behavior: "smooth" });
  }

  // Défilement automatique : avance, puis revient au début en boucle.
  useEffect(() => {
    const el = trackRef.current;
    if (!el || items.length <= 1) return;
    let paused = false;
    const onEnter = () => (paused = true);
    const onLeave = () => (paused = false);
    el.addEventListener("mouseenter", onEnter);
    el.addEventListener("mouseleave", onLeave);

    const timer = window.setInterval(() => {
      if (paused) return;
      const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 8;
      if (atEnd) {
        el.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        el.scrollBy({ left: Math.max(280, el.clientWidth * 0.8), behavior: "smooth" });
      }
    }, 3500);

    return () => {
      window.clearInterval(timer);
      el.removeEventListener("mouseenter", onEnter);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, [items.length]);

  if (items.length === 0) return null;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => scrollByCards(-1)}
        aria-label="Précédent"
        className="absolute -left-3 top-1/2 z-10 hidden -translate-y-1/2 h-11 w-11 items-center justify-center rounded-full border-2 border-foreground bg-cream font-display text-xl shadow-[3px_3px_0_0_var(--ashoka)] hover:bg-saffron md:flex"
      >
        ‹
      </button>

      <div
        ref={trackRef}
        className="carousel-track flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth px-1 py-4"
      >
        {items.map((p) => (
          <div key={p.id} className="w-64 shrink-0 snap-start">
            <ProductCard p={p} />
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() => scrollByCards(1)}
        aria-label="Suivant"
        className="absolute -right-3 top-1/2 z-10 hidden -translate-y-1/2 h-11 w-11 items-center justify-center rounded-full border-2 border-foreground bg-cream font-display text-xl shadow-[3px_3px_0_0_var(--ashoka)] hover:bg-saffron md:flex"
      >
        ›
      </button>
    </div>
  );
}
