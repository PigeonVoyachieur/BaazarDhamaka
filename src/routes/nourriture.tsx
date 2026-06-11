import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { CategoryHero } from "@/components/CategoryHero";
import { ProductCard } from "@/components/ProductCard";
import { FakeUrgencyPopup } from "@/components/FakeUrgencyPopup";
import { fetchByCategory } from "@/data/products";

export const Route = createFileRoute("/nourriture")({
  head: () => ({
    meta: [
      { title: "Nourriture — Bazaar Dhamaka" },
      { name: "description", content: "Snacks périmés, plats mystères et boissons radioactives. Livrés tièdes en 47 jours." },
      { property: "og:title", content: "Nourriture — Bazaar Dhamaka" },
      { property: "og:description", content: "Samosas surgelés éternels, curry niveau 11 et autres délices douteux." },
    ],
  }),
  loader: () => fetchByCategory("nourriture"),
  component: Page,
});

function Page() {
  const items = Route.useLoaderData();
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <CategoryHero
        title="NOURRITURE"
        tagline="Des saveurs venues d'ailleurs (et d'un autre temps). Chaîne du froid garantie rompue avec amour."
        emoji="🍛"
        bgClass="bg-saffron/30"
      />
      <section className="mx-auto max-w-7xl px-4 py-12">
        {items.length === 0 ? (
          <p className="text-center text-muted-foreground italic py-10">
            Aucun plat pour l'instant. Lance <code>npm run seed</code> pour remplir le frigo.
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {items.map((p) => <ProductCard key={p.id} p={p} />)}
          </div>
        )}
      </section>
      <SiteFooter />
      <FakeUrgencyPopup />
    </div>
  );
}
