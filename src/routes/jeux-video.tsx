import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { CategoryHero } from "@/components/CategoryHero";
import { ProductCard } from "@/components/ProductCard";
import { FakeUrgencyPopup } from "@/components/FakeUrgencyPopup";
import { fetchByCategory } from "@/data/products";

export const Route = createFileRoute("/jeux-video")({
  head: () => ({
    meta: [
      { title: "Jeux Vidéo — Bazaar Dhamaka" },
      { name: "description", content: "Le gaming next-gen de la génération précédente. PleyStation 6, Xbox Series Z, FIFA 47." },
      { property: "og:title", content: "Jeux Vidéo — Bazaar Dhamaka" },
      { property: "og:description", content: "Consoles, manettes tactiles sans boutons et VR en carton." },
    ],
  }),
  loader: () => fetchByCategory("jeux-video"),
  component: Page,
});

function Page() {
  const items = Route.useLoaderData();
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <CategoryHero
        title="JEUX VIDÉO"
        tagline="Le gaming next-gen de la génération précédente. Cricket mode débloqué dans tous les jeux."
        emoji="🎮"
        bgClass="bg-saffron/40"
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
