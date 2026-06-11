const SLOGANS = [
  "🛺 LIVRAISON EN 47 JOURS (ou plus) 🛺",
  "💥 MEGA DHAMAKA SALE -97% 💥",
  "🪔 PAIEMENT EN 19 FOIS SANS FRAIS (avec frais) 🪔",
  "🎬 BOLLYWOOD APPROVED ™ 🎬",
  "🏏 GARANTIE 30 SECONDES 🏏",
  "🍛 1 SAMOSA OFFERT TOUS LES 200€ 🍛",
];

export function MarqueeBar() {
  const items = [...SLOGANS, ...SLOGANS, ...SLOGANS];
  return (
    <div className="border-y-2 border-foreground bg-saffron py-2 overflow-hidden">
      <div className="marquee-track font-display text-sm text-foreground">
        {items.map((s, i) => (
          <span key={i} className="mx-8">{s}</span>
        ))}
      </div>
    </div>
  );
}
