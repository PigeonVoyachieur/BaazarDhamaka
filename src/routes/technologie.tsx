import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { CategoryHero } from "@/components/CategoryHero";
import { ProductCard } from "@/components/ProductCard";
import { FakeUrgencyPopup } from "@/components/FakeUrgencyPopup";
import { fetchByCategory } from "@/data/products";

export const Route = createFileRoute("/technologie")({
  head: () => ({
    meta: [
      { title: "Technologie — Bazaar Dhamaka" },
      { name: "description", content: "Tech de pointe (de 2009). iPhonne, écouteurs sans fil avec fil, chargeurs universels." },
      { property: "og:title", content: "Technologie — Bazaar Dhamaka" },
      { property: "og:description", content: "iPhonne 47 Pro Max, drones 8K et autres innovations douteuses." },
    ],
  }),
  loader: () => fetchByCategory("technologie"),
  component: Page,
});

function Page() {
  const items = Route.useLoaderData();
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <CategoryHero
        title="TECHNOLOGIE"
        tagline="Technologie de pointe (de 2009). Tous nos produits sont certifiés branchables sur au moins 1 prise."
        emoji="📱"
        bgClass="bg-india-green/30"
      />
      <section className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {items.map((p) => <ProductCard key={p.id} p={p} />)}
        </div>
      </section>
      <SiteFooter />
      <FakeUrgencyPopup />
    </div>
  );
}
