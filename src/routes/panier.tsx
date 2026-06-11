import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { createOrder } from "@/data/products";
import { useCart } from "@/lib/cart";

export const Route = createFileRoute("/panier")({
  head: () => ({
    meta: [
      { title: "Mon panier — Bazaar Dhamaka" },
      { name: "description", content: "Vérifiez vos articles et passez commande en 47 jours (ou 247 avec Prime)." },
    ],
  }),
  component: CartPage,
});

type Customer = { name: string; email: string; address: string };
const EMPTY_CUSTOMER: Customer = { name: "", email: "", address: "" };

type DeliveryOption = {
  id: "standard" | "prime";
  label: string;
  price: number;
  days: number;
  desc: string;
};

const DELIVERY_OPTIONS: DeliveryOption[] = [
  {
    id: "standard",
    label: "Standard Dhamaka",
    price: 89.99,
    days: 47,
    desc: "Frais de port « raisonnables ». Livraison express en 47 jours (en moyenne).",
  },
  {
    id: "prime",
    label: "Dhamaka Prime ⭐",
    price: 499.99,
    days: 247,
    desc: "L'abonnement de luxe : payez 6× plus cher pour attendre 5× plus longtemps. Le vrai privilège.",
  },
];

function CartPage() {
  const navigate = useNavigate();
  const { items, total, count, setQty, remove, clear } = useCart();
  const [customer, setCustomer] = useState<Customer>(EMPTY_CUSTOMER);
  const [deliveryId, setDeliveryId] = useState<DeliveryOption["id"]>("standard");
  const [status, setStatus] = useState<"idle" | "saving" | "error">("idle");
  const [message, setMessage] = useState("");

  const set = (key: keyof Customer) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setCustomer((c) => ({ ...c, [key]: e.target.value }));

  const delivery = DELIVERY_OPTIONS.find((d) => d.id === deliveryId)!;
  const shipping = items.length > 0 ? delivery.price : 0;
  const grandTotal = total + shipping;

  async function handleOrder(e: React.FormEvent) {
    e.preventDefault();
    if (!customer.name.trim() || !customer.email.trim() || !customer.address.trim()) {
      setStatus("error");
      setMessage("Nom, email et adresse sont obligatoires pour commander.");
      return;
    }
    setStatus("saving");
    setMessage("");
    try {
      const lines = [
        ...items.map((i) => ({
          productId: i.id,
          name: i.name,
          price: i.price,
          qty: i.qty,
        })),
        {
          productId: "__delivery__",
          name: `Livraison ${delivery.label} (${delivery.days} jours)`,
          price: delivery.price,
          qty: 1,
        },
      ];
      const id = await createOrder(customer, lines);
      clear();
      setCustomer(EMPTY_CUSTOMER);
      // Redirection vers l'easter egg de confirmation.
      navigate({
        to: "/commande",
        search: { order: id, days: delivery.days },
      });
    } catch (err) {
      console.error(err);
      setStatus("error");
      setMessage(
        "Échec de la commande. Vérifie que les règles d'écriture Firestore autorisent la collection « orders »."
      );
    }
  }

  const inputCls =
    "w-full rounded-md border-2 border-foreground bg-card px-3 py-2 outline-none focus:bg-saffron/10";
  const labelCls = "block font-display text-xs text-ashoka mb-1";

  return (
    <div className="min-h-screen">
      <SiteHeader />

      <section className="mx-auto max-w-6xl px-4 py-10">
        <div className="dhamaka-badge inline-block mb-4">MON PANIER</div>
        <h1 className="font-display text-4xl md:text-6xl text-ashoka leading-none">
          VOTRE <span className="text-bollywood">PANIER</span>
        </h1>

        {items.length === 0 ? (
          <div className="mt-12 rounded-2xl border-2 border-foreground bg-card p-12 text-center shadow-[8px_8px_0_0_var(--ashoka)]">
            <div className="text-6xl mb-4">🛒💨</div>
            <p className="font-display text-xl text-ashoka">Votre panier est vide</p>
            <p className="mt-2 text-muted-foreground italic">
              Foncez profiter de nos -97% (sur les choses dont vous n'avez pas besoin).
            </p>
            <Link
              to="/"
              className="peep-btn mt-6 inline-block rounded-md bg-saffron border-2 border-foreground px-6 py-3 font-display hover:bg-bollywood hover:text-white transition-colors"
            >
              DÉCOUVRIR LES ARTICLES
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid gap-8 lg:grid-cols-3">
            {/* LISTE DES ARTICLES + LIVRAISON */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((i) => (
                <div
                  key={i.id}
                  className="flex items-center gap-4 rounded-xl border-2 border-foreground bg-card p-4 shadow-[4px_4px_0_0_var(--saffron)]"
                >
                  <Link
                    to="/produit/$id"
                    params={{ id: i.id }}
                    className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-lg border-2 border-foreground bg-gradient-to-br from-saffron/30 via-cream to-india-green/30 text-4xl"
                  >
                    {i.image ? (
                      <img src={i.image} alt={i.name} className="h-full w-full object-contain p-1" />
                    ) : (
                      <span>{i.emoji ?? "📦"}</span>
                    )}
                  </Link>

                  <div className="min-w-0 flex-1">
                    <Link
                      to="/produit/$id"
                      params={{ id: i.id }}
                      className="font-display text-sm text-foreground hover:text-bollywood line-clamp-2"
                    >
                      {i.name}
                    </Link>
                    <div className="mt-1 font-display text-lg text-india-green">{i.price}€</div>
                  </div>

                  <div className="flex items-center rounded-md border-2 border-foreground bg-card">
                    <button
                      type="button"
                      onClick={() => setQty(i.id, i.qty - 1)}
                      className="px-3 py-1.5 font-display hover:bg-saffron/40"
                      aria-label="Diminuer"
                    >
                      −
                    </button>
                    <span className="w-8 text-center font-display">{i.qty}</span>
                    <button
                      type="button"
                      onClick={() => setQty(i.id, i.qty + 1)}
                      className="px-3 py-1.5 font-display hover:bg-saffron/40"
                      aria-label="Augmenter"
                    >
                      +
                    </button>
                  </div>

                  <div className="hidden sm:block w-20 text-right font-display text-bollywood">
                    {(i.price * i.qty).toFixed(2)}€
                  </div>

                  <button
                    type="button"
                    onClick={() => remove(i.id)}
                    className="shrink-0 rounded-md border-2 border-foreground bg-card px-2 py-1 text-sm hover:bg-destructive hover:text-destructive-foreground transition-colors"
                    aria-label="Retirer l'article"
                  >
                    🗑️
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={clear}
                className="text-sm font-display text-bollywood underline"
              >
                Vider le panier
              </button>

              {/* CHOIX DE LIVRAISON */}
              <div className="mt-6 rounded-2xl border-2 border-foreground bg-card p-5 shadow-[6px_6px_0_0_var(--india-green)]">
                <h2 className="font-display text-xl text-ashoka mb-1">MODE DE LIVRAISON</h2>
                <p className="text-xs text-muted-foreground mb-4 italic">
                  Plus c'est cher, plus c'est lent. C'est ça, le prestige.
                </p>
                <div className="space-y-3">
                  {DELIVERY_OPTIONS.map((opt) => {
                    const active = opt.id === deliveryId;
                    return (
                      <label
                        key={opt.id}
                        className={`flex cursor-pointer items-start gap-3 rounded-lg border-2 p-3 transition-colors ${
                          active
                            ? "border-foreground bg-saffron/20"
                            : "border-foreground/30 hover:border-foreground hover:bg-saffron/5"
                        }`}
                      >
                        <input
                          type="radio"
                          name="delivery"
                          className="mt-1 h-4 w-4 accent-bollywood"
                          checked={active}
                          onChange={() => setDeliveryId(opt.id)}
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-display text-sm text-foreground">{opt.label}</span>
                            <span className="font-display text-india-green">{opt.price.toFixed(2)}€</span>
                          </div>
                          <p className="mt-0.5 text-xs text-muted-foreground">{opt.desc}</p>
                          <p className="mt-1 text-[11px] font-display text-bollywood">
                            ⏱️ Délai estimé : {opt.days} jours
                          </p>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* RÉCAPITULATIF + COMMANDE */}
            <form
              onSubmit={handleOrder}
              className="h-fit rounded-2xl border-2 border-foreground bg-card p-5 shadow-[8px_8px_0_0_var(--ashoka)] space-y-4"
            >
              <h2 className="font-display text-xl text-ashoka">RÉCAPITULATIF</h2>

              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Sous-total ({count} article{count > 1 ? "s" : ""})</span>
                  <span>{total.toFixed(2)}€</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Livraison ({delivery.days} jours)
                  </span>
                  <span>{shipping.toFixed(2)}€</span>
                </div>
                <div className="flex justify-between border-t-2 border-foreground pt-2 font-display text-lg">
                  <span>TOTAL</span>
                  <span className="text-india-green">{grandTotal.toFixed(2)}€</span>
                </div>
              </div>

              <div className="border-t-2 border-foreground pt-4 space-y-3">
                <div>
                  <label className={labelCls}>Nom complet *</label>
                  <input
                    className={inputCls}
                    placeholder="Raj Patel"
                    value={customer.name}
                    onChange={set("name")}
                  />
                </div>
                <div>
                  <label className={labelCls}>Email *</label>
                  <input
                    className={inputCls}
                    type="email"
                    placeholder="raj@dhamaka.com"
                    value={customer.email}
                    onChange={set("email")}
                  />
                </div>
                <div>
                  <label className={labelCls}>Adresse de livraison *</label>
                  <textarea
                    className={inputCls}
                    rows={2}
                    placeholder="42 rue du Bazar, Mumbai"
                    value={customer.address}
                    onChange={set("address")}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={status === "saving"}
                className="peep-btn w-full rounded-md bg-bollywood text-white border-2 border-foreground px-5 py-3 font-display disabled:opacity-60"
              >
                {status === "saving" ? "COMMANDE EN COURS…" : "COMMANDER 🛺"}
              </button>

              {status === "error" && message && (
                <p className="rounded-md border-2 border-foreground bg-destructive/15 px-3 py-2 text-sm">
                  {message}
                </p>
              )}
            </form>
          </div>
        )}
      </section>

      <SiteFooter />
    </div>
  );
}
