"use client";

import { useState } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import type { AdCategory } from "@/lib/types";

const categoryOptions: AdCategory[] = [
  "Pendidikan",
  "Makanan & Minuman",
  "Kreatif & Digital",
  "Bantuan & Layanan Harian",
  "Barang Baru & Bekas",
  "Lainnya",
];

const inputClass =
  "h-11 w-full rounded-input border border-border bg-white px-4 text-[14px] text-charcoal placeholder:text-muted focus:border-cta focus:outline-none focus:ring-3 focus:ring-cta/10";
const labelClass = "text-[12px] font-bold text-muted-foreground";

export default function PasangSayembaraPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<AdCategory | "">("");
  const [location, setLocation] = useState("");
  const [priceLabel, setPriceLabel] = useState("");
  const [waNego, setWaNego] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const canSubmit =
    title.trim() !== "" &&
    description.trim() !== "" &&
    category !== "" &&
    location.trim() !== "";

  async function handleSubmit() {
    setSubmitting(true);
    setSubmitError(null);

    try {
      const res = await fetch("/api/sayembara", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          category,
          location,
          priceLabel: priceLabel.trim() || undefined,
          waNego,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.error ?? "Gagal memasang sayembara.");
      }

      setSubmitted(true);
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "Gagal memasang sayembara.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <>
        <Header title="Pasang Sayembara" />
        <main className="flex-1 px-6 py-8">
          <div className="mx-auto max-w-xl">
            <div className="flex flex-col items-center rounded-card border-[2.5px] border-ink bg-white shadow-[3px_3px_0_0_rgba(20,20,20,1)] p-10 text-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-success/10 text-2xl text-success">
                ✓
              </span>
              <h2 className="mt-4 text-xl font-bold text-charcoal">
                Sayembara Berhasil Dipasang
              </h2>
              <p className="mt-2 max-w-sm text-[14px] font-normal text-muted-foreground">
                Pengumumanmu sudah tayang. Calon penyedia jasa bisa mulai
                mendaftarkan diri.
              </p>

              <Link
                href="/sayembara"
                className="mt-6 flex h-11 w-full max-w-xs items-center justify-center rounded-pill bg-charcoal text-base font-bold text-white transition-colors hover:bg-black"
              >
                Lihat Sayembara
              </Link>
            </div>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Header title="Pasang Sayembara" />

      <main className="flex-1 px-6 py-8">
        <div className="mx-auto max-w-xl">
          <h2 className="text-xl font-bold text-charcoal">
            Pasang Sayembara Jasa
          </h2>
          <p className="mt-1 text-[14px] font-normal text-muted-foreground">
            Beritahu komunitas Masisir kebutuhan jasamu.
          </p>

          <form className="mt-6 flex flex-col gap-5 rounded-card border-[2.5px] border-ink bg-white shadow-[3px_3px_0_0_rgba(20,20,20,1)] p-6">
            <div>
              <label className={labelClass} htmlFor="title">
                Judul Kebutuhan
              </label>
              <input
                id="title"
                className={`mt-1 ${inputClass}`}
                placeholder="Contoh: Butuh Bantuan Pindahan Kos"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
              />
            </div>

            <div>
              <label className={labelClass} htmlFor="description">
                Deskripsi
              </label>
              <textarea
                id="description"
                rows={4}
                className={`mt-1 ${inputClass} h-auto resize-none py-3`}
                placeholder="Jelaskan kebutuhanmu secara detail"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
              />
            </div>

            <div>
              <label className={labelClass} htmlFor="location">
                Lokasi
              </label>
              <input
                id="location"
                className={`mt-1 ${inputClass}`}
                placeholder="Contoh: Nasr City, Kairo"
                value={location}
                onChange={(event) => setLocation(event.target.value)}
              />
            </div>

            <div>
              <label className={labelClass} htmlFor="priceLabel">
                Harga (opsional)
              </label>
              <input
                id="priceLabel"
                className={`mt-1 ${inputClass}`}
                placeholder="Contoh: Rp 100.000 atau Nego"
                value={priceLabel}
                onChange={(event) => setPriceLabel(event.target.value)}
              />
            </div>

            <label
              htmlFor="waNego"
              className="flex cursor-pointer items-center justify-between gap-3 rounded-input border border-border-subtle px-4 py-3"
            >
              <div>
                <p className="text-[14px] font-bold text-charcoal">
                  Nego pembayaran via WA
                </p>
                <p className="mt-0.5 text-[12px] font-normal text-muted-foreground">
                  Biarkan calon penyedia jasa tahu harga masih bisa dinego lewat
                  WhatsApp.
                </p>
              </div>
              <input
                id="waNego"
                type="checkbox"
                checked={waNego}
                onChange={(event) => setWaNego(event.target.checked)}
                className="h-5 w-5 shrink-0 accent-charcoal"
              />
            </label>

            <div>
              <p className={labelClass}>Kategori</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {categoryOptions.map((option) => {
                  const isActive = category === option;
                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setCategory(option)}
                      aria-pressed={isActive}
                      className={`h-9 rounded-pill border-2 px-4 text-[14px] font-bold transition-colors ${
                        isActive
                          ? "border-ink bg-charcoal text-white"
                          : "border-ink bg-transparent text-charcoal hover:bg-surface"
                      }`}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
            </div>
          </form>

          {submitError && (
            <div className="mt-4 rounded-card border border-error/40 bg-error/5 px-4 py-3">
              <p className="text-[14px] font-normal text-error">{submitError}</p>
            </div>
          )}

          <button
            type="button"
            disabled={!canSubmit || submitting}
            onClick={handleSubmit}
            className="mt-6 flex h-11 w-full items-center justify-center rounded-pill bg-charcoal text-base font-bold text-white transition-colors hover:bg-black disabled:bg-muted disabled:text-[#707070]"
          >
            {submitting ? "Memasang..." : "Pasang Sayembara"}
          </button>
        </div>
      </main>
    </>
  );
}
