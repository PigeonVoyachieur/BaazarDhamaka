type Props = {
  title: string;
  tagline: string;
  emoji: string;
  bgClass: string;
};

export function CategoryHero({ title, tagline, emoji, bgClass }: Props) {
  return (
    <section className={`relative overflow-hidden border-b-2 border-foreground ${bgClass}`}>
      <div className="absolute inset-0 opacity-10 text-[200px] flex items-center justify-center pointer-events-none select-none">
        {emoji}
      </div>
      <div className="relative mx-auto max-w-7xl px-4 py-16 md:py-24">
        <div className="dhamaka-badge inline-block mb-4">DHAMAKA CATEGORY</div>
        <h1 className="font-display text-5xl md:text-7xl text-foreground leading-none">
          {title}
        </h1>
        <p className="mt-4 max-w-xl text-lg italic text-foreground/80">{tagline}</p>
        <div className="mt-6 flex flex-wrap gap-2 text-xs font-display">
          <span className="rounded-full bg-foreground text-cream px-3 py-1">⚡ EXPÉDITION EN 47 JOURS</span>
          <span className="rounded-full bg-cream border-2 border-foreground px-3 py-1">🪔 -90% GARANTI</span>
          <span className="rounded-full bg-bollywood text-white px-3 py-1">💥 MEGA SALE</span>
        </div>
      </div>
      <div className="rangoli-border" />
    </section>
  );
}
