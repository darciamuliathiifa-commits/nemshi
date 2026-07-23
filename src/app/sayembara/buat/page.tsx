"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Category = { id: string; name: string; slug: string; icon: string };
type Area = { id: string; name: string; slug: string };

export default function BuatSayembaraPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);

  const [title, setTitle] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [areaId, setAreaId] = useState("");
  const [description, setDescription] = useState("");
  const [whatsappLink, setWhatsappLink] = useState("");
  const [priceType, setPriceType] = useState<"Range" | "Contact">("Contact");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [tier, setTier] = useState<"Gratis" | "Prioritas">("Gratis");
  const [paymentMethod, setPaymentMethod] = useState<"Bayar" | "Kuota">("Bayar");
  const [prioritySlotQuota, setPrioritySlotQuota] = useState(0);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch("/api/categories").then((r) => r.json()),
      fetch("/api/areas").then((r) => r.json()),
      fetch("/api/me/activity").then((r) => (r.ok ? r.json() : { quotas: [] })),
    ]).then(([categoriesData, areasData, activity]) => {
      setCategories(categoriesData);
      setAreas(areasData);
      if (categoriesData[0]) setCategoryId(categoriesData[0].id);
      if (areasData[0]) setAreaId(areasData[0].id);
      const slot = activity.quotas?.find(
        (q: { quotaType: string; remainingAmount: number }) => q.quotaType === "Priority_Slot"
      );
      setPrioritySlotQuota(slot?.remainingAmount ?? 0);
    });
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    const response = await fetch("/api/sayembara", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        categoryId,
        areaId,
        description,
        whatsappLink,
        priceType,
        priceMin,
        priceMax,
        tier,
        paymentMethod: tier === "Prioritas" ? paymentMethod : undefined,
      }),
    });

    setSubmitting(false);

    if (response.status === 401) {
      router.push("/masuk?redirectTo=/sayembara/buat");
      return;
    }

    if (!response.ok) {
      const body = await response.json();
      setError(body.error ?? "Gagal membuat sayembara.");
      return;
    }

    const { order } = await response.json();
    if (order) {
      router.push(`/bayar/${order.id}`);
    } else {
      router.push("/sayembara/saya");
    }
  }

  return (
    <main className="bg-gradient-to-b from-surface-tint to-white">
      <div className="mx-auto max-w-xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="mb-2 text-2xl font-bold text-text">Buat Sayembara Cari Jasa</h1>
        <p className="mb-6 text-sm text-text-secondary">
          Publikasikan kebutuhan jasamu. Penyedia yang relevan akan melihat postingan ini dan
          menghubungimu langsung lewat WhatsApp.
        </p>

        <form
          onSubmit={handleSubmit}
          className="rounded-3xl flex flex-col gap-3 border border-black/5 bg-white p-6"
        >
        <label className="flex flex-col gap-1 text-sm text-text-secondary">
          Judul Kebutuhan
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Contoh: Butuh jasa pindahan kost akhir bulan ini"
            className="rounded-lg border border-black/10 px-3 py-2 text-text outline-none focus:border-accent focus:ring-4 focus:ring-accent/10"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm text-text-secondary">
          Kategori
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="rounded-lg border border-black/10 px-3 py-2 text-text outline-none focus:border-accent focus:ring-4 focus:ring-accent/10"
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.icon} {c.name}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1 text-sm text-text-secondary">
          Area
          <select
            value={areaId}
            onChange={(e) => setAreaId(e.target.value)}
            className="rounded-lg border border-black/10 px-3 py-2 text-text outline-none focus:border-accent focus:ring-4 focus:ring-accent/10"
          >
            {areas.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1 text-sm text-text-secondary">
          Deskripsi Kebutuhan
          <textarea
            required
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="rounded-lg border border-black/10 px-3 py-2 text-text outline-none focus:border-accent focus:ring-4 focus:ring-accent/10"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm text-text-secondary">
          Link WhatsApp Kamu
          <input
            type="text"
            required
            value={whatsappLink}
            onChange={(e) => setWhatsappLink(e.target.value)}
            placeholder="https://wa.me/20XXXXXXXXXX"
            className="rounded-lg border border-black/10 px-3 py-2 text-text outline-none focus:border-accent focus:ring-4 focus:ring-accent/10"
          />
        </label>

        <div className="flex flex-col gap-1 text-sm text-text-secondary">
          Estimasi Budget
          <div className="flex gap-3">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                checked={priceType === "Contact"}
                onChange={() => setPriceType("Contact")}
              />
              Budget via Kontak
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                checked={priceType === "Range"}
                onChange={() => setPriceType("Range")}
              />
              Angka Pasti
            </label>
          </div>
          {priceType === "Range" && (
            <div className="mt-2 flex gap-2">
              <input
                type="number"
                value={priceMin}
                onChange={(e) => setPriceMin(e.target.value)}
                placeholder="Min (EGP)"
                className="w-full rounded-lg border border-black/10 px-3 py-2 text-text outline-none focus:border-accent focus:ring-4 focus:ring-accent/10"
              />
              <input
                type="number"
                value={priceMax}
                onChange={(e) => setPriceMax(e.target.value)}
                placeholder="Maks (EGP)"
                className="w-full rounded-lg border border-black/10 px-3 py-2 text-text outline-none focus:border-accent focus:ring-4 focus:ring-accent/10"
              />
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2 text-sm text-text-secondary">
          Pilihan Tayang
          <label
            className={`flex items-start gap-2 rounded-xl border p-3 transition-colors ${
              tier === "Gratis" ? "border-primary bg-surface-tint" : "border-black/10"
            }`}
          >
            <input
              type="radio"
              checked={tier === "Gratis"}
              onChange={() => setTier("Gratis")}
              className="mt-1"
            />
            <span>
              <span className="block font-medium text-text">Gratis</span>
              Tayang 24 jam. Maksimal 1x setiap 30 hari.
            </span>
          </label>
          <label
            className={`flex items-start gap-2 rounded-xl border p-3 transition-colors ${
              tier === "Prioritas" ? "border-primary bg-surface-tint" : "border-black/10"
            }`}
          >
            <input
              type="radio"
              checked={tier === "Prioritas"}
              onChange={() => setTier("Prioritas")}
              className="mt-1"
            />
            <span>
              <span className="block font-medium text-text">Prioritas — Rp12.000</span>
              Tayang 3 hari dan tampil menonjol (pin to top).
            </span>
          </label>
        </div>

        {tier === "Prioritas" && (
          <div className="flex flex-col gap-2 text-sm text-text-secondary">
            Cara Bayar
            <label
              className={`flex items-center gap-2 rounded-xl border p-3 transition-colors ${
                paymentMethod === "Bayar" ? "border-primary bg-surface-tint" : "border-black/10"
              }`}
            >
              <input
                type="radio"
                checked={paymentMethod === "Bayar"}
                onChange={() => setPaymentMethod("Bayar")}
              />
              Bayar Rp12.000
            </label>
            <label
              className={`flex items-center gap-2 rounded-xl border p-3 transition-colors ${
                paymentMethod === "Kuota" ? "border-primary bg-surface-tint" : "border-black/10"
              }`}
            >
              <input
                type="radio"
                checked={paymentMethod === "Kuota"}
                onChange={() => setPaymentMethod("Kuota")}
                disabled={prioritySlotQuota <= 0}
              />
              Pakai Kuota Paket Plus ({prioritySlotQuota} tersisa)
            </label>
          </div>
        )}

        {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="rounded-full mt-2 bg-primary px-5 py-3 font-semibold text-white transition-colors hover:bg-primary-dark disabled:opacity-60"
          >
            {submitting
              ? "Memproses..."
              : tier === "Prioritas"
                ? paymentMethod === "Kuota"
                  ? "Pasang dengan Kuota"
                  : "Lanjut ke Pembayaran"
                : "Pasang Gratis"}
          </button>
        </form>
      </div>
    </main>
  );
}
