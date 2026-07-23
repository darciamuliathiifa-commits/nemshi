"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ImageUploader } from "@/components/image-uploader";

type Category = { id: string; name: string; slug: string; icon: string };
type Area = { id: string; name: string; slug: string };

export default function PasangIklanPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
  const [listingSlotQuota, setListingSlotQuota] = useState(0);

  const [title, setTitle] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [areaId, setAreaId] = useState("");
  const [description, setDescription] = useState("");
  const [whatsappLink, setWhatsappLink] = useState("");
  const [priceType, setPriceType] = useState<"Range" | "Contact">("Contact");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [photos, setPhotos] = useState<string[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<"Bayar" | "Kuota">("Bayar");
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
        (q: { quotaType: string; remainingAmount: number }) => q.quotaType === "Listing_Slot"
      );
      setListingSlotQuota(slot?.remainingAmount ?? 0);
    });
  }, []);

  function updatePhoto(index: number, url: string) {
    setPhotos((prev) => prev.map((p, i) => (i === index ? url : p)));
  }

  function removePhotoField(index: number) {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    const response = await fetch("/api/listings", {
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
        paymentMethod,
        photos: photos.filter((p) => p.trim()),
      }),
    });

    setSubmitting(false);

    if (response.status === 401) {
      router.push("/masuk?redirectTo=/pasang-iklan");
      return;
    }

    if (!response.ok) {
      const body = await response.json();
      setError(body.error ?? "Gagal memasang iklan.");
      return;
    }

    const { order } = await response.json();
    if (order) {
      router.push(`/bayar/${order.id}`);
    } else {
      router.push("/iklan-saya");
    }
  }

  return (
    <main className="bg-gradient-to-b from-surface-tint to-white">
      <div className="mx-auto max-w-xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="mb-2 text-2xl font-bold text-text">Pasang Iklan Tawarkan Jasa</h1>
        <p className="mb-6 text-sm text-text-secondary">
          Iklan akan tayang 30 hari setelah lolos moderasi admin. Nemshi menjamin exposure
          (tampilan dan klik), bukan kepastian kesepakatan kerja.
        </p>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-3 border border-black/5 bg-white p-6"
        >
        <label className="flex flex-col gap-1 text-sm text-text-secondary">
          Judul Iklan
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Contoh: Jasa Titip Beli & Antar Barang Kairo"
            className="border border-black/10 px-3 py-2 text-text outline-none focus:border-accent"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm text-text-secondary">
          Kategori
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="border border-black/10 px-3 py-2 text-text outline-none focus:border-accent"
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.icon} {c.name}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1 text-sm text-text-secondary">
          Area Layanan
          <select
            value={areaId}
            onChange={(e) => setAreaId(e.target.value)}
            className="border border-black/10 px-3 py-2 text-text outline-none focus:border-accent"
          >
            {areas.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1 text-sm text-text-secondary">
          Deskripsi Jasa
          <textarea
            required
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border border-black/10 px-3 py-2 text-text outline-none focus:border-accent"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm text-text-secondary">
          Link WhatsApp
          <input
            type="text"
            required
            value={whatsappLink}
            onChange={(e) => setWhatsappLink(e.target.value)}
            placeholder="https://wa.me/20XXXXXXXXXX"
            className="border border-black/10 px-3 py-2 text-text outline-none focus:border-accent"
          />
        </label>

        <div className="flex flex-col gap-1 text-sm text-text-secondary">
          Opsi Harga
          <div className="flex gap-3">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                checked={priceType === "Contact"}
                onChange={() => setPriceType("Contact")}
              />
              Hubungi untuk Harga
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                checked={priceType === "Range"}
                onChange={() => setPriceType("Range")}
              />
              Tampilkan Kisaran Harga
            </label>
          </div>
          {priceType === "Range" && (
            <div className="mt-2 flex gap-2">
              <input
                type="number"
                value={priceMin}
                onChange={(e) => setPriceMin(e.target.value)}
                placeholder="Min (EGP)"
                className="w-full border border-black/10 px-3 py-2 text-text outline-none focus:border-accent"
              />
              <input
                type="number"
                value={priceMax}
                onChange={(e) => setPriceMax(e.target.value)}
                placeholder="Maks (EGP)"
                className="w-full border border-black/10 px-3 py-2 text-text outline-none focus:border-accent"
              />
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2 text-sm text-text-secondary">
          Foto Portofolio (maks. 5)
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
            {photos.map((photo, index) => (
              <ImageUploader
                key={index}
                value={photo}
                folder="listings"
                aspectClassName="aspect-square"
                onChange={(url) => updatePhoto(index, url)}
                onRemove={() => removePhotoField(index)}
              />
            ))}
            {photos.length < 5 && (
              <ImageUploader
                value=""
                folder="listings"
                aspectClassName="aspect-square"
                onChange={(url) => setPhotos((prev) => [...prev, url])}
              />
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2 text-sm text-text-secondary">
          Cara Bayar
          <label
            className={`flex items-start gap-2 border p-3 transition-colors ${
              paymentMethod === "Bayar" ? "border-primary bg-surface-tint" : "border-black/10"
            }`}
          >
            <input
              type="radio"
              checked={paymentMethod === "Bayar"}
              onChange={() => setPaymentMethod("Bayar")}
              className="mt-1"
            />
            <span>
              <span className="block font-medium text-text">Bayar Rp50.000</span>
              Lewat QRIS / Virtual Account.
            </span>
          </label>
          <label
            className={`flex items-start gap-2 border p-3 transition-colors ${
              paymentMethod === "Kuota" ? "border-primary bg-surface-tint" : "border-black/10"
            }`}
          >
            <input
              type="radio"
              checked={paymentMethod === "Kuota"}
              onChange={() => setPaymentMethod("Kuota")}
              disabled={listingSlotQuota <= 0}
              className="mt-1"
            />
            <span>
              <span className="block font-medium text-text">
                Pakai Kuota Paket Plus ({listingSlotQuota} tersisa)
              </span>
              {listingSlotQuota <= 0
                ? "Tidak ada kuota tersisa — beli Paket Plus terlebih dahulu."
                : "Langsung terpakai tanpa biaya tambahan."}
            </span>
          </label>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="mt-2 bg-primary px-5 py-3 font-semibold text-white transition-colors hover:bg-primary-dark disabled:opacity-60"
          >
            {submitting
              ? "Memproses..."
              : paymentMethod === "Bayar"
                ? "Lanjut ke Pembayaran"
                : "Pasang dengan Kuota"}
          </button>
        </form>
      </div>
    </main>
  );
}
