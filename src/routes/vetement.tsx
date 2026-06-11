import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { CategoryHero } from "@/components/CategoryHero";
import { ProductCard } from "@/components/ProductCard";
import { FakeUrgencyPopup } from "@/components/FakeUrgencyPopup";
import { fetchByCategory } from "@/data/products";

export const Route = createFileRoute("/vetement")({
  head: () => ({
    meta: [
      { title: "Vêtements — Bazaar Dhamaka" },
      { name: "description", content: "Mode Bollywood et marques ressemblantes. Adibas, Mike, Guuci, Louis Vitton." },
      { property: "og:title", content: "Vêtements — Bazaar Dhamaka" },
      { property: "og:description", content: "Saris glitter, sneakers Mike et casquettes Guuci® (Réplique Évidente)." },
    ],
  }),
  loader: () => fetchByCategory("vetement"),
  component: Page,
});

function Page() {
  const items = Route.useLoaderData();
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <CategoryHero
        title="VÊTEMENTS"
        tagline="Mode Bollywood, paillettes garanties. Toutes nos marques ressemblent à des vraies marques."
        emoji="👗"
        bgClass="bg-bollywood/25"
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
