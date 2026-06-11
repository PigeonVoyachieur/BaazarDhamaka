import { createFileRoute, Link } from "@tanstack/react-router";

// Easter egg : vidéo d'ambiance en fond de page. 🎶
const YT_VIDEO_ID = "LtOiIIkdWLc";

export const Route = createFileRoute("/commande")({
  head: () => ({
    meta: [
      { title: "Commande confirmée — Bazaar Dhamaka" },
      { name: "description", content: "Merci pour votre commande (et bonne écoute)." },
    ],
  }),
  validateSearch: (search: Record<string, unknown>) => ({
    order: typeof search.order === "string" ? search.order : "",
    days: Number(search.days) || 47,
  }),
  component: OrderConfirmation,
});

function OrderConfirmation() {
  const { order, days } = Route.useSearch();
  const orderRef = order ? order.slice(0, 8).toUpperCase() : "DHAMAKA";

  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-cream">
      {/* Vidéo YouTube en fond plein écran (easter egg) */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <iframe
          title="Ambiance Bazaar Dhamaka"
          className="absolute left-1/2 top-1/2 h-[120vh] w-[120vw] -translate-x-1/2 -translate-y-1/2"
          src={`https://www.youtube.com/embed/${YT_VIDEO_ID}?autoplay=1&loop=1&playlist=${YT_VIDEO_ID}&controls=0&modestbranding=1&rel=0&playsinline=1`}
          allow="autoplay; encrypted-media"
          frameBorder="0"
        />
      </div>

      {/* Voile sombre pour la lisibilité */}
      <div className="absolute inset-0 z-10 bg-black/55" />

      {/* Contenu de confirmation */}
      <div className="relative z-20 flex min-h-screen flex-col items-center justify-center px-4 py-16 text-center">
        <div className="text-7xl mb-4 animate-bounce">🎉🛺🎉</div>
        <div className="dhamaka-badge inline-block mb-4">COMMANDE CONFIRMÉE</div>
        <h1 className="font-display text-4xl md:text-6xl leading-none drop-shadow-[3px_3px_0_rgba(0,0,0,0.6)]">
          MERCI <span className="text-saffron">BHAI</span> !
        </h1>

        <div className="mt-6 w-full max-w-md rounded-2xl border-2 border-cream/60 bg-black/50 p-6 backdrop-blur-sm">
          <p className="text-sm opacity-90">Votre commande</p>
          <p className="font-display text-2xl text-saffron">#{orderRef}</p>
          <p className="mt-3 text-sm opacity-90">
            est enregistrée et part bientôt à dos de mule. Livraison estimée dans{" "}
            <span className="font-display text-bollywood">{days} jours</span> (en moyenne, et si tout va bien).
          </p>
          <p className="mt-3 text-xs italic opacity-70">
            🎵 En attendant, profitez de notre playlist d'ambiance soigneusement sélectionnée.
          </p>
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            to="/"
            className="peep-btn rounded-md bg-bollywood text-white border-2 border-cream px-6 py-3 font-display"
          >
            CONTINUER LE SHOPPING
          </Link>
          <Link
            to="/nourriture"
            className="rounded-md bg-saffron text-foreground border-2 border-cream px-6 py-3 font-display hover:bg-cream transition-colors"
          >
            UN PETIT SNACK ? 🍛
          </Link>
        </div>

        <p className="mt-10 text-[11px] opacity-60">
          Astuce : montez le son. 🔊 (Aucun remboursement pour préjudice auditif.)
        </p>
      </div>
    </div>
  );
}
