import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const NAMES = ["Priya de Mumbai", "Raj de Bangalore", "Anjali de Delhi", "Vikram de Kolkata", "Kévin de Roubaix", "Meera de Chennai"];
const ITEMS = ["iPhonne 47", "Sari Glitter", "PleyStation 6", "Sneakers Mike", "Casquette Guuci", "Chargeur Universel"];

export function FakeUrgencyPopup() {
  const [visible, setVisible] = useState(false);
  const [msg, setMsg] = useState({ name: "", item: "", sec: 2 });

  useEffect(() => {
    const tick = () => {
      setMsg({
        name: NAMES[Math.floor(Math.random() * NAMES.length)],
        item: ITEMS[Math.floor(Math.random() * ITEMS.length)],
        sec: Math.floor(Math.random() * 30) + 1,
      });
      setVisible(true);
      setTimeout(() => setVisible(false), 4000);
    };
    const t = setTimeout(tick, 3000);
    const i = setInterval(tick, 9000);
    return () => { clearTimeout(t); clearInterval(i); };
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ x: -300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -300, opacity: 0 }}
          className="fixed bottom-6 left-6 z-50 max-w-xs rounded-lg border-2 border-foreground bg-card p-3 shadow-[4px_4px_0_0_var(--bollywood)]"
        >
          <div className="flex items-start gap-2">
            <span className="text-2xl">🎉</span>
            <div className="text-xs">
              <div className="font-display text-sm text-bollywood">{msg.name}</div>
              <div className="text-foreground">vient d'acheter <span className="font-semibold">{msg.item}</span></div>
              <div className="text-muted-foreground">il y a {msg.sec} secondes</div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
