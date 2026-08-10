"use client";

import { useState } from "react";
import Link from "next/link";
import type { AdCategory } from "@/lib/types";
import {
  composePriceLabel,
  currencyOptions,
  formatThousands,
  onlyDigits,
  type CurrencyCode,
} from "@/lib/format-currency";

const categoryOptions: AdCategory[] = [
  "Pendidikan",
  "Makanan & Minuman",
  "Kreatif & Digital",
  "Bantuan & Layanan Harian",
  "Barang Baru & Bekas",
  "Perjalanan & Travel",
  "Titipan & Bagasi",
  "Lainnya",
];

const inputClass =
  "h-11 w-full rounded-input border border-border bg-white px-4 text-[14px] text-charcoal placeholder:text-muted focus:border-cta focus:outline-none focus:ring-3 focus:ring-cta/10";
const labelClass = "text-[12px] font-bold text-muted-foreground";

export interface SayembaraFormSubmitValues {
  title: string;
  description: string;
  category: AdCategory;
  location: string;
  priceLabel: string | null;
  waNego: boolean;
}

export interface SayembaraFormInitialValues {
  title?: string;
  description?: string;
  category?: AdCategory | "";
  location?: string;
  priceAmount?: string;
  currency?: CurrencyCode;
  waNego?: boolean;
}

export function SayembaraForm({
  initialValues,
  submitLabel,
  submittingLabel,
  onSubmit,
}: {
  initialValues?: SayembaraFormInitialValues;
  submitLabel: string;
  submittingLabel: string;
  onSubmit: (values: SayembaraFormSubmitValues) => Promise<void>;
}) {
  const [title, setTitle] = useState(initialValues?.title ?? "");
  const [description, setDescription] = useState(initialValues?.description ?? "");
  const [category, setCategory] = useState<AdCategory | "">(initialValues?.category ?? "");
  const [location, setLocation] = useState(initialValues?.location ?? "");
  const [priceAmount, setPriceAmount] = useState(initialValues?.priceAmount ?? "");
  const [currency, setCurrency] = useState<CurrencyCode>(initialValues?.currency ?? "IDR");
  const [waNego, setWaNego] = useState(initialValues?.waNego ?? false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const canSubmit =
    title.trim() !== "" &&
    description.trim() !== "" &&
    category !== "" &&
    location.trim() !== "";

  async function handleSubmit() {
    if (!category) return;

    setSubmitting(true);
    setSubmitError(null);

    try {
      await onSubmit({
        title,
        description,
        category,
        location,
        priceLabel: priceAmount ? composePriceLabel(currency, priceAmount) : null,
        waNego,
      });
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "Gagal menyimpan sayembara.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
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
          <label className={labelClass} htmlFor="priceAmount">
            Harga (opsional)
          </label>
          <div className="mt-1 flex gap-2">
            <select
              aria-label="Mata uang"
              className="h-11 w-32 shrink-0 rounded-input border border-border bg-white px-3 text-[14px] text-charcoal focus:border-cta focus:outline-none focus:ring-3 focus:ring-cta/10"
              value={currency}
              onChange={(event) => setCurrency(event.target.value as CurrencyCode)}
            >
              {currencyOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <input
              id="priceAmount"
              inputMode="numeric"
              className={inputClass}
              placeholder="100.000"
              value={formatThousands(priceAmount)}
              onChange={(event) => setPriceAmount(onlyDigits(event.target.value))}
            />
          </div>
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
        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 rounded-card border border-error/40 bg-error/5 px-4 py-3">
          <p className="text-[14px] font-normal text-error">{submitError}</p>
          {submitError.includes("Kuota") && (
            <Link
              href="/paket-plus"
              className="shrink-0 text-[14px] font-bold text-cta hover:text-highlight"
            >
              Lihat Paket Plus
            </Link>
          )}
        </div>
      )}

      <button
        type="button"
        disabled={!canSubmit || submitting}
        onClick={handleSubmit}
        className="mt-6 flex h-11 w-full items-center justify-center rounded-pill bg-charcoal text-base font-bold text-white transition-colors hover:bg-black disabled:bg-muted disabled:text-[#707070]"
      >
        {submitting ? submittingLabel : submitLabel}
      </button>
    </>
  );
}
