import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const SECONDS = 3;

// Une quinzaine de promos absurdes. pct < 0 = réduction (bon plan),
// pct > 0 = augmentation (arnaque assumée).
const PROMOS = [
  { emoji: "🚪", item: "les portes", pct: -10 },
  { emoji: "🍢", item: "la street food", pct: 50 },
  { emoji: "🧦", item: "les chaussettes dépareillées", pct: -30 },
  { emoji: "🛺", item: "les klaxons de tuk-tuk", pct: 20 },
  { emoji: "🐄", item: "les vaches sacrées", pct: -15 },
  { emoji: "🤳", item: "les selfies", pct: 99 },
  { emoji: "🌶️", item: "le piment", pct: 70 },
  { emoji: "🥸", item: "les moustaches", pct: -40 },
  { emoji: "📱", item: "les vrais iPhones (faux)", pct: -50 },
  { emoji: "😤", item: "la patience", pct: 10 },
  { emoji: "🛗", item: "les ascenseurs en panne", pct: -80 },
  { emoji: "🍌", item: "les bananes", pct: 60 },
  { emoji: "🥟", item: "les samosas froids", pct: -12 },
  { emoji: "🕊️", item: "les pigeons messagers", pct: 35 },
  { emoji: "🚗", item: "les embouteillages", pct: -25 },
  { emoji: "☕", item: "le chai brûlant", pct: 45 },
];

export function PromoBanner() {
  const [index, setIndex] = useState(0);
  const [count, setCount] = useState(SECONDS);

  useEffect(() => {
    const id = setInterval(() => {
      setCount((c) => {
        if (c <= 1) {
          // Fin du décompte : on passe à une promo différente.
          setIndex((prev) => {
            let next = Math.floor(Math.random() * PROMOS.length);
            if (next === prev) next = (prev + 1) % PROMOS.length;
            return next;
          });
          return SECONDS;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const promo = PROMOS[index];
  const isDeal = promo.pct < 0;
  const sign = promo.pct > 0 ? "+" : "";

  return (
    <div
      className={`relative overflow-hidden border-b-2 border-foreground py-2 ${
        isDeal ? "bg-india-green text-cream" : "bg-bollywood text-white"
      }`}
    >
      {/* Barre de progression du décompte */}
      <motion.div
        key={`bar-${index}`}
        className="absolute bottom-0 left-0 h-1 bg-saffron"
        initial={{ width: "0%" }}
        animate={{ width: "100%" }}
        transition={{ duration: SECONDS, ease: "linear" }}
      />

      <div className="mx-auto flex max-w-7xl items-center justify-center gap-3 px-4">
        {/* TIMER VISIBLE */}
        <span
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 border-foreground bg-cream font-display text-sm text-foreground tabular-nums"
          aria-label={`${count} secondes`}
        >
          {count}
        </span>

        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="flex items-center gap-2 font-display text-xs sm:text-sm"
          >
            <span className="text-base">{promo.emoji}</span>
            <span className="font-bold">
              {sign}
              {promo.pct}%
            </span>
            <span>sur {promo.item}</span>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
