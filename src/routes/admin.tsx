import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { ProductCard } from "@/components/ProductCard";
import {
  addProduct,
  CATEGORIES,
  type CategorySlug,
  type Product,
} from "@/data/products";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Ajouter un article — Bazaar Dhamaka" },
      { name: "description", content: "Ajoutez un produit directement sur le site." },
    ],
  }),
  component: AdminPage,
});

type FormState = {
  name: string;
  tagline: string;
  price: string;
  original: string;
  image: string;
  emoji: string;
  badge: string;
  category: CategorySlug;
};

const EMPTY: FormState = {
  name: "",
  tagline: "",
  price: "",
  original: "",
  image: "",
  emoji: "",
  badge: "",
  category: "technologie",
};

/**
 * Redimensionne et compresse une image locale côté navigateur, puis la renvoie
 * en data URL (JPEG). Garde le poids bas pour rester sous la limite Firestore (~1 Mo).
 */
function compressImage(file: File, maxSize = 700, quality = 0.82): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(reader.error);
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("Image illisible"));
      img.onload = () => {
        const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
        const w = Math.max(1, Math.round(img.width * scale));
        const h = Math.max(1, Math.round(img.height * scale));
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        if (!ctx) return reject(new Error("Canvas indisponible"));
        ctx.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}

function AdminPage() {
  const [form, setForm] = useState<FormState>(EMPTY);
  const [status, setStatus] = useState<"idle" | "saving" | "ok" | "error">("idle");
  const [message, setMessage] = useState("");

  const set = (key: keyof FormState) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => setForm((f) => ({ ...f, [key]: e.target.value }));

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await compressImage(file);
      setForm((f) => ({ ...f, image: dataUrl }));
    } catch (err) {
      console.error(err);
      setStatus("error");
      setMessage("Impossible de lire cette image.");
    }
  }

  // Carte d'aperçu en direct.
  const preview: Product = {
    id: "preview",
    name: form.name || "Nom du produit",
    tagline: form.tagline || "Description du produit…",
    price: Number(form.price) || 0,
    original: form.original ? Number(form.original) : undefined,
    image: form.image || undefined,
    emoji: form.emoji || "📦",
    badge: form.badge || undefined,
    category: form.category,
    rating: 4.5,
    reviews: 1234,
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.tagline.trim() || !form.price) {
      setStatus("error");
      setMessage("Titre, description et prix sont obligatoires.");
      return;
    }
    setStatus("saving");
    setMessage("");
    try {
      await addProduct({
        name: form.name,
        tagline: form.tagline,
        price: Number(form.price),
        original: form.original ? Number(form.original) : undefined,
        image: form.image || undefined,
        emoji: form.emoji || undefined,
        badge: form.badge || undefined,
        category: form.category,
      });
      setStatus("ok");
      setMessage(`« ${form.name} » ajouté à la catégorie ${form.category} ! 🎉`);
      setForm({ ...EMPTY, category: form.category });
    } catch (err) {
      console.error(err);
      setStatus("error");
      setMessage(
        "Échec de l'ajout. Vérifie que les règles d'écriture Firestore sont ouvertes."
      );
    }
  }

  // Réduction calculée à partir du prix barré (pour l'aperçu).
  const priceNum = Number(form.price);
  const originalNum = Number(form.original);
  const previewDiscount =
    form.original && originalNum > priceNum && priceNum > 0
      ? Math.round((1 - priceNum / originalNum) * 100)
      : null;

  const inputCls =
    "w-full rounded-md border-2 border-foreground bg-card px-3 py-2 outline-none focus:bg-saffron/10";
  const labelCls = "block font-display text-xs text-ashoka mb-1";

  return (
    <div className="min-h-screen">
      <SiteHeader />

      <section className="mx-auto max-w-6xl px-4 py-10">
        <div className="dhamaka-badge inline-block mb-4">ESPACE VENDEUR</div>
        <h1 className="font-display text-4xl md:text-6xl text-ashoka leading-none">
          AJOUTER UN <span className="text-bollywood">ARTICLE</span>
        </h1>
        <p className="mt-3 text-muted-foreground italic">
          Remplis les champs, l'article est enregistré dans la base et apparaît
          aussitôt dans sa catégorie.
        </p>

        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          {/* FORMULAIRE */}
          <form
            onSubmit={handleSubmit}
            className="rounded-2xl border-2 border-foreground bg-card p-5 shadow-[8px_8px_0_0_var(--ashoka)] space-y-4"
          >
            <div className="rounded-lg border-2 border-foreground bg-saffron/15 p-3">
              <label className={labelCls}>Catégorie de l'article *</label>
              <select className={inputCls} value={form.category} onChange={set("category")}>
                {CATEGORIES.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.label}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-[11px] text-muted-foreground">
                Détermine la page où l'article apparaîtra.
              </p>
            </div>

            <div>
              <label className={labelCls}>Photo de l'article</label>
              <div className="flex items-center gap-3">
                {form.image && (
                  <img
                    src={form.image}
                    alt="aperçu"
                    className="h-14 w-14 shrink-0 rounded-md border-2 border-foreground object-cover"
                  />
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFile}
                  className="block w-full text-xs file:mr-3 file:rounded-md file:border-2 file:border-foreground file:bg-saffron file:px-3 file:py-2 file:font-display file:text-foreground"
                />
                {form.image && (
                  <button
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, image: "" }))}
                    className="shrink-0 text-xs font-display text-bollywood underline"
                  >
                    Retirer
                  </button>
                )}
              </div>
              <input
                className={`${inputCls} mt-2`}
                type="url"
                placeholder="…ou colle une URL d'image"
                value={form.image.startsWith("data:") ? "" : form.image}
                onChange={set("image")}
              />
              <p className="mt-1 text-[11px] text-muted-foreground">
                Importe une photo depuis ton ordinateur (redimensionnée
                automatiquement) ou colle une URL. Sinon, un emoji est utilisé.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2">
                <label className={labelCls}>Titre *</label>
                <input
                  className={inputCls}
                  placeholder="iPhonne 47 Pro Max"
                  value={form.name}
                  onChange={set("name")}
                />
              </div>
              <div>
                <label className={labelCls}>Emoji</label>
                <input
                  className={inputCls}
                  placeholder="📱"
                  value={form.emoji}
                  onChange={set("emoji")}
                />
              </div>
            </div>

            <div>
              <label className={labelCls}>Description *</label>
              <textarea
                className={inputCls}
                rows={2}
                placeholder="Compatible avec 1 chargeur (vendu séparément)"
                value={form.tagline}
                onChange={set("tagline")}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Prix (€) *</label>
                <input
                  className={inputCls}
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="49"
                  value={form.price}
                  onChange={set("price")}
                />
              </div>
              <div>
                <label className={labelCls}>Prix barré (€)</label>
                <input
                  className={inputCls}
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="1299"
                  value={form.original}
                  onChange={set("original")}
                />
                {previewDiscount != null ? (
                  <p className="mt-1 text-[11px] font-display text-india-green">
                    → Réduction affichée : -{previewDiscount}%
                  </p>
                ) : (
                  <p className="mt-1 text-[11px] text-muted-foreground">
                    Optionnel — doit être supérieur au prix.
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className={labelCls}>Badge (optionnel)</label>
              <input
                className={inputCls}
                placeholder="TOP CHOICE BHAI"
                value={form.badge}
                onChange={set("badge")}
              />
            </div>

            <button
              type="submit"
              disabled={status === "saving"}
              className="peep-btn w-full rounded-md bg-bollywood text-white border-2 border-foreground px-5 py-3 font-display disabled:opacity-60"
            >
              {status === "saving" ? "ENREGISTREMENT…" : "AJOUTER L'ARTICLE 🛒"}
            </button>

            {message && (
              <p
                className={`rounded-md border-2 border-foreground px-3 py-2 text-sm ${
                  status === "ok"
                    ? "bg-india-green/20 text-foreground"
                    : "bg-destructive/15 text-foreground"
                }`}
              >
                {message}
              </p>
            )}

            {status === "ok" && (
              <a
                href={`/${form.category}`}
                className="block text-center font-display text-sm text-bollywood underline"
              >
                Voir la catégorie →
              </a>
            )}
          </form>

          {/* APERCU */}
          <div>
            <div className="font-display text-sm text-ashoka mb-3">APERÇU EN DIRECT</div>
            <div className="max-w-xs">
              <ProductCard p={preview} />
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
