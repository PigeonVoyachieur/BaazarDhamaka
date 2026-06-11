import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { MarqueeBar } from "./MarqueeBar";
import { PromoBanner } from "./PromoBanner";

function ChakraLogo() {
  return (
    <svg viewBox="0 0 40 40" className="chakra-spin h-9 w-9 shrink-0">
      <circle cx="20" cy="20" r="18" fill="none" stroke="var(--ashoka)" strokeWidth="2" />
      {Array.from({ length: 24 }).map((_, i) => (
        <line
          key={i}
          x1="20" y1="20" x2="20" y2="3"
          stroke="var(--ashoka)" strokeWidth="1"
          transform={`rotate(${(360 / 24) * i} 20 20)`}
        />
      ))}
      <circle cx="20" cy="20" r="3" fill="var(--ashoka)" />
    </svg>
  );
}

const LINKS = [
  { to: "/", label: "ACCUEIL", exact: true },
  { to: "/technologie", label: "TECHNOLOGIE" },
  { to: "/jeux-video", label: "JEUX VIDÉO" },
  { to: "/vetement", label: "VÊTEMENTS" },
  { to: "/admin", label: "➕ AJOUTER" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b-2 border-foreground bg-cream/95 backdrop-blur">
      <MarqueeBar />
      <PromoBanner />
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3">
        <Link to="/" className="flex items-center gap-2 group" onClick={() => setOpen(false)}>
          <ChakraLogo />
          <div className="leading-none">
            <div className="font-display text-xl sm:text-2xl text-bollywood">Bazaar</div>
            <div className="font-display text-[10px] sm:text-xs text-india-green tracking-widest">DHAMAKA.COM</div>
          </div>
        </Link>

        {/* Navigation desktop */}
        <nav className="hidden md:flex items-center gap-1 font-display text-sm">
          {LINKS.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="px-3 py-1.5 rounded-md hover:bg-saffron/40 transition"
              activeProps={{ className: "px-3 py-1.5 rounded-md bg-saffron text-foreground" }}
              activeOptions={l.exact ? { exact: true } : undefined}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden lg:flex items-center rounded-md border-2 border-foreground bg-card px-3 py-1.5 text-sm">
            <span className="mr-2">🔍</span>
            <input
              placeholder="Search kya chahiye?"
              className="bg-transparent outline-none w-36 placeholder:text-muted-foreground"
            />
          </div>
          <button className="peep-btn relative rounded-md border-2 border-foreground bg-bollywood px-3 py-1.5 font-display text-sm text-white">
            <span className="hidden sm:inline">🛒 PANIER</span>
            <span className="sm:hidden">🛒</span>
            <span className="absolute -top-2 -right-2 rounded-full bg-india-green px-1.5 text-[10px] text-white border border-foreground blink">99+</span>
          </button>

          {/* Bouton menu mobile */}
          <button
            className="md:hidden rounded-md border-2 border-foreground bg-card px-3 py-1.5 font-display text-sm"
            aria-label="Menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* Menu déroulant mobile */}
      {open && (
        <nav className="md:hidden border-t-2 border-foreground bg-cream px-4 py-2 font-display text-sm">
          {LINKS.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className="block rounded-md px-3 py-2 hover:bg-saffron/40 transition"
              activeProps={{ className: "block rounded-md px-3 py-2 bg-saffron text-foreground" }}
              activeOptions={l.exact ? { exact: true } : undefined}
            >
              {l.label}
            </Link>
          ))}
        </nav>
      )}

      <div className="rangoli-border" />
    </header>
  );
}
