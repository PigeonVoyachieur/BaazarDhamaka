import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Product } from "@/data/products";

export type CartItem = {
  id: string;
  name: string;
  price: number;
  image?: string;
  emoji?: string;
  qty: number;
};

type CartContextValue = {
  items: CartItem[];
  count: number;
  total: number;
  add: (p: Pick<Product, "id" | "name" | "price" | "image" | "emoji">, qty?: number) => void;
  remove: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "bazaar-dhamaka-cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Restaure le panier depuis le navigateur (uniquement côté client).
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw) as CartItem[]);
    } catch {
      /* panier illisible : on repart à vide */
    }
    setHydrated(true);
  }, []);

  // Persiste à chaque changement, une fois l'hydratation faite.
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* quota plein : on ignore */
    }
  }, [items, hydrated]);

  const value = useMemo<CartContextValue>(() => {
    const add: CartContextValue["add"] = (p, qty = 1) =>
      setItems((prev) => {
        const existing = prev.find((i) => i.id === p.id);
        if (existing) {
          return prev.map((i) =>
            i.id === p.id ? { ...i, qty: i.qty + qty } : i
          );
        }
        return [
          ...prev,
          {
            id: p.id,
            name: p.name,
            price: p.price,
            image: p.image,
            emoji: p.emoji,
            qty,
          },
        ];
      });

    const remove: CartContextValue["remove"] = (id) =>
      setItems((prev) => prev.filter((i) => i.id !== id));

    const setQty: CartContextValue["setQty"] = (id, qty) =>
      setItems((prev) =>
        qty <= 0
          ? prev.filter((i) => i.id !== id)
          : prev.map((i) => (i.id === id ? { ...i, qty } : i))
      );

    const clear: CartContextValue["clear"] = () => setItems([]);

    const count = items.reduce((n, i) => n + i.qty, 0);
    const total = items.reduce((s, i) => s + i.price * i.qty, 0);

    return { items, count, total, add, remove, setQty, clear };
  }, [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart doit être utilisé dans <CartProvider>");
  return ctx;
}
