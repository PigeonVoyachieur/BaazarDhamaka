export function SiteFooter() {
  return (
    <footer className="mt-20 border-t-2 border-foreground bg-ashoka text-cream">
      <div className="rangoli-border" />
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 md:grid-cols-4">
        <div>
          <div className="font-display text-2xl text-saffron">Bazaar Dhamaka</div>
          <p className="mt-2 text-sm opacity-80">
            Le n°1 mondial du shopping en ligne depuis hier matin. Plus de 47 clients
            satisfaits (sur 12 millions).
          </p>
        </div>
        <div>
          <div className="font-display text-sm text-saffron mb-3">SERVICE CLIENT</div>
          <ul className="space-y-1 text-sm opacity-80">
            <li>FAQ (les Q sans les R)</li>
            <li>Politique de remboursement : lol non</li>
            <li>Garantie 30 secondes</li>
            <li>Contact : envoyer un pigeon</li>
          </ul>
        </div>
        <div>
          <div className="font-display text-sm text-saffron mb-3">PAIEMENTS</div>
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="rounded border border-cream px-2 py-1">VISO</span>
            <span className="rounded border border-cream px-2 py-1">MasterCart</span>
            <span className="rounded border border-cream px-2 py-1">PayPel</span>
            <span className="rounded border border-cream px-2 py-1">Roupies</span>
            <span className="rounded border border-cream px-2 py-1">Samosas</span>
          </div>
        </div>
        <div>
          <div className="font-display text-sm text-saffron mb-3">NEWSLETTER</div>
          <p className="text-sm opacity-80 mb-2">Inscrivez-vous pour recevoir 47 emails par jour.</p>
          <div className="flex gap-2">
            <input className="flex-1 rounded border border-cream bg-transparent px-2 py-1 text-sm" placeholder="votre@email.com" />
            <button className="rounded bg-saffron px-3 py-1 font-display text-xs text-foreground">OK</button>
          </div>
        </div>
      </div>
      <div className="border-t border-cream/20 py-4 text-center text-xs opacity-70">
        © 2009-2026 Bazaar Dhamaka — Site parodique. Aucun samosa n'a été blessé.
      </div>
    </footer>
  );
}
