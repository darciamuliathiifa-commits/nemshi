"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/header";
import { PhotoUploader } from "@/components/forms/photo-uploader";
import { DescriptionEditor } from "@/components/forms/description-editor";
import { DescriptionText } from "@/components/shared/description-text";
import { QuotaExceededModal } from "@/components/shared/quota-exceeded-modal";
import { uploadPhotos, type UploadedPhoto } from "@/lib/upload";
import type { AdCategory, AdCondition, AdKind } from "@/lib/types";
import {
  BookIcon,
  BoxIcon,
  MegaphoneIcon,
  SparklesIcon,
  TagIcon,
  UtensilsIcon,
} from "@/components/icons";
import {
  composePriceLabel,
  currencyOptions,
  formatThousands,
  onlyDigits,
  type CurrencyCode,
} from "@/lib/format-currency";

const kindOptions: { value: AdKind; label: string; description: string }[] = [
  {
    value: "produk",
    label: "Produk",
    description: "Jual barang baru atau bekas: foto, harga, kondisi, dan lokasi.",
  },
  {
    value: "jasa",
    label: "Jasa",
    description: "Tawarkan keahlian: portofolio, harga awal, dan estimasi pengerjaan.",
  },
];

const categoryOptions: AdCategory[] = [
  "Pendidikan",
  "Makanan & Minuman",
  "Kreatif & Digital",
  "Bantuan & Layanan Harian",
  "Barang Baru & Bekas",
  "Lainnya",
];

const categoryIcons: Record<AdCategory, (props: { width?: number; height?: number; className?: string }) => React.ReactElement> = {
  Pendidikan: BookIcon,
  "Makanan & Minuman": UtensilsIcon,
  "Kreatif & Digital": SparklesIcon,
  "Bantuan & Layanan Harian": MegaphoneIcon,
  "Barang Baru & Bekas": BoxIcon,
  Lainnya: TagIcon,
};

const conditionOptions: AdCondition[] = ["Baru", "Bekas"];
const deliveryOptions = ["Via WA", "COD", "Pickup Sendiri"];

const locationOptions = [
  "Online",
  "Hay Asyir",
  "Hay Sabi",
  "Tabbah",
  "Darrasah",
  "Hay Tsamin",
  "Saqr Quraisy",
  "Zahraa",
  "Buust",
  "Gamaliyah",
  "Tahrir",
];
const CUSTOM_LOCATION_VALUE = "__lainnya__";

const inputClass =
  "h-11 w-full rounded-input border border-border bg-white px-4 text-[14px] text-charcoal placeholder:text-muted focus:border-cta focus:outline-none focus:ring-3 focus:ring-cta/10";
const labelClass = "text-[12px] font-bold text-muted-foreground";

interface FormState {
  title: string;
  description: string;
  location: string;
  customLocation: string;
  priceAmount: string;
  currency: CurrencyCode;
  condition: AdCondition | "";
  deliveryMethod: string;
  scope: string;
  estimatedDuration: string;
  photos: UploadedPhoto[];
}

const initialForm: FormState = {
  title: "",
  description: "",
  location: "",
  customLocation: "",
  priceAmount: "",
  currency: "IDR",
  condition: "",
  deliveryMethod: "",
  scope: "",
  estimatedDuration: "",
  photos: [],
};

export default function PasangIklanPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [published, setPublished] = useState(false);
  const [publishedStatus, setPublishedStatus] = useState<string | null>(null);
  const [publishing, setPublishing] = useState(false);
  const [publishError, setPublishError] = useState<string | null>(null);
  const [selectedKind, setSelectedKind] = useState<AdKind | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<AdCategory | null>(null);
  const [form, setForm] = useState<FormState>(initialForm);
  const [showQuotaModal, setShowQuotaModal] = useState(false);

  // Buyers reach sellers over WhatsApp, so an ad without a number is dead on
  // arrival. Onboarding collects it but is skippable, so ask here as well —
  // this is the moment the seller actually cares, which is when they'll fill
  // it in rather than dismiss it.
  const [needsWhatsapp, setNeedsWhatsapp] = useState(false);
  const [whatsappNumber, setWhatsappNumber] = useState("");

  useEffect(() => {
    let active = true;
    fetch("/api/profile")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!active || !data) return;
        setNeedsWhatsapp(!data.whatsappNumber?.trim());
      })
      .catch(() => {
        // Offline or logged out — the server rejects the publish anyway.
      });
    return () => {
      active = false;
    };
  }, []);

  const canContinueStep1 = selectedKind !== null && selectedCategory !== null;

  const resolvedLocation =
    form.location === CUSTOM_LOCATION_VALUE ? form.customLocation.trim() : form.location;

  const canContinueStep2 =
    form.title.trim() !== "" &&
    form.description.trim() !== "" &&
    resolvedLocation !== "" &&
    (!needsWhatsapp || whatsappNumber.trim() !== "") &&
    (selectedKind === "produk"
      ? form.priceAmount.trim() !== "" && form.condition !== "" && form.deliveryMethod !== ""
      : form.priceAmount.trim() !== "" && form.scope.trim() !== "" && form.estimatedDuration.trim() !== "");

  function updateForm<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  const priceLabel = composePriceLabel(form.currency, form.priceAmount);

  async function handlePublish() {
    if (!selectedKind || !selectedCategory) return;

    setPublishing(true);
    setPublishError(null);

    try {
      // Save the number to the profile first, so it also serves every later ad
      // and the server-side check passes.
      if (needsWhatsapp && whatsappNumber.trim()) {
        const profileRes = await fetch("/api/profile", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ whatsappNumber: whatsappNumber.trim() }),
        });
        if (!profileRes.ok) {
          const data = await profileRes.json().catch(() => ({}));
          throw new Error(data.error ?? "Gagal menyimpan nomor WhatsApp.");
        }
        setNeedsWhatsapp(false);
      }

      const quotaRes = await fetch("/api/mayar/quota");
      if (quotaRes.ok) {
        const quota = await quotaRes.json();
        const hasSlot =
          quota.isUnlimited || !quota.freeAdSlotUsed || quota.extraAdSlots > 0;
        if (!hasSlot) {
          setShowQuotaModal(true);
          setPublishing(false);
          return;
        }
      }

      const photoUrls = await uploadPhotos(form.photos);

      const res = await fetch("/api/ads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind: selectedKind,
          title: form.title,
          description: form.description,
          category: selectedCategory,
          location: resolvedLocation,
          priceLabel,
          condition: selectedKind === "produk" ? form.condition : undefined,
          deliveryMethod: selectedKind === "produk" ? form.deliveryMethod : undefined,
          scope: selectedKind === "jasa" ? form.scope : undefined,
          estimatedDuration: selectedKind === "jasa" ? form.estimatedDuration : undefined,
          photos: photoUrls,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.error ?? "Gagal mempublikasikan iklan.");
      }

      setPublishedStatus(data.status ?? "Aktif");
      setPublished(true);
      router.refresh();
    } catch (err) {
      setPublishError(
        err instanceof Error ? err.message : "Gagal mempublikasikan iklan.",
      );
    } finally {
      setPublishing(false);
    }
  }

  return (
    <>
      <Header title="Pasang Iklan" containerClassName="max-w-2xl" />

      <main className="flex-1 px-6 py-8">
        <div className="mx-auto max-w-2xl">
          {!published && (
            <div className="mb-6 flex items-center gap-2">
              {[1, 2, 3].map((s) => (
                <span
                  key={s}
                  className={`h-1.5 flex-1 rounded-pill transition-colors ${
                    s <= step ? "bg-cta" : "bg-surface"
                  }`}
                />
              ))}
            </div>
          )}

          {step === 1 && (
            <>
              <div className="mb-6 flex items-center justify-between gap-3 rounded-card border border-border-subtle bg-surface/60 px-4 py-3">
                <p className="text-[14px] font-normal text-charcoal">
                  Sudah pakai slot gratis? Upgrade ke Paket Plus untuk slot dan
                  promosi tambahan.
                </p>
                <Link
                  href="/paket-plus"
                  className="shrink-0 text-[14px] font-bold text-cta hover:text-highlight"
                >
                  Lihat Paket Plus
                </Link>
              </div>

              <h2 className="text-xl font-bold text-charcoal">
                Pilih Tipe & Kategori Iklan
              </h2>
              <p className="mt-1 text-[14px] font-normal text-muted-foreground">
                Langkah 1 dari 3: tentukan jenis iklan dan kategorinya.
              </p>

              <div className="mt-6 rounded-card border border-border-subtle bg-white p-6">
                <p className={labelClass}>Tipe Iklan</p>
                <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {kindOptions.map((option) => {
                    const isActive = selectedKind === option.value;
                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setSelectedKind(option.value)}
                        aria-pressed={isActive}
                        className={`rounded-card border p-4 text-left transition-colors ${
                          isActive
                            ? "border-cta bg-cta/5"
                            : "border-border hover:border-border-strong"
                        }`}
                      >
                        <span className="text-base font-bold text-charcoal">
                          {option.label}
                        </span>
                        <p className="mt-1 text-[14px] font-normal text-muted-foreground">
                          {option.description}
                        </p>
                      </button>
                    );
                  })}
                </div>

                <p className={`mt-6 ${labelClass}`}>Kategori</p>
                <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {categoryOptions.map((category) => {
                    const isActive = selectedCategory === category;
                    const Icon = categoryIcons[category];
                    return (
                      <button
                        key={category}
                        type="button"
                        onClick={() => setSelectedCategory(category)}
                        aria-pressed={isActive}
                        className={`flex flex-col items-center gap-2 rounded-card border-2 p-4 text-center transition-colors ${
                          isActive
                            ? "border-charcoal bg-charcoal text-white"
                            : "border-border bg-white text-charcoal hover:border-border-strong"
                        }`}
                      >
                        <span
                          className={`flex h-10 w-10 items-center justify-center rounded-full ${
                            isActive ? "bg-white/20" : "bg-surface"
                          }`}
                        >
                          <Icon width={18} height={18} />
                        </span>
                        <span className="text-[13px] font-bold leading-4">{category}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                type="button"
                disabled={!canContinueStep1}
                onClick={() => setStep(2)}
                className="mt-6 flex h-11 w-full items-center justify-center rounded-pill bg-charcoal text-base font-bold text-white transition-colors hover:bg-black disabled:bg-muted disabled:text-[#707070] disabled:hover:bg-muted"
              >
                Lanjutkan
              </button>
            </>
          )}

          {step === 2 && selectedKind && selectedCategory && (
            <>
              <h2 className="text-xl font-bold text-charcoal">Isi Formulir Iklan</h2>
              <p className="mt-1 text-[14px] font-normal text-muted-foreground">
                Langkah 2 dari 3: lengkapi detail iklan {selectedKind} kategori{" "}
                {selectedCategory}.
              </p>

              <form className="mt-6 flex flex-col gap-5 rounded-card border border-border-subtle bg-white p-6">
                <div>
                  <label className={labelClass} htmlFor="title">
                    Judul Iklan
                  </label>
                  <input
                    id="title"
                    className={`mt-1 ${inputClass}`}
                    placeholder="Contoh: Rice Cooker Mini 1.5L"
                    value={form.title}
                    onChange={(event) => updateForm("title", event.target.value)}
                  />
                </div>

                <div>
                  <label className={labelClass} htmlFor="description">
                    Deskripsi
                  </label>
                  <DescriptionEditor
                    id="description"
                    rows={4}
                    className="mt-1"
                    placeholder="Jelaskan detail produk atau jasa yang kamu tawarkan"
                    value={form.description}
                    onChange={(value) => updateForm("description", value)}
                  />
                </div>

                <div>
                  <label className={labelClass} htmlFor="location">
                    Lokasi
                  </label>
                  <select
                    id="location"
                    className={`mt-1 ${inputClass}`}
                    value={form.location}
                    onChange={(event) => updateForm("location", event.target.value)}
                  >
                    <option value="" disabled>
                      Pilih lokasi
                    </option>
                    {locationOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                    <option value={CUSTOM_LOCATION_VALUE}>Lainnya (isi manual)</option>
                  </select>
                  {form.location === CUSTOM_LOCATION_VALUE && (
                    <input
                      className={`mt-2 ${inputClass}`}
                      placeholder="Tulis lokasi kamu"
                      value={form.customLocation}
                      onChange={(event) => updateForm("customLocation", event.target.value)}
                    />
                  )}
                </div>

                {needsWhatsapp && (
                  <div>
                    <label className={labelClass} htmlFor="whatsappNumber">
                      Nomor WhatsApp
                    </label>
                    <input
                      id="whatsappNumber"
                      inputMode="tel"
                      className={`mt-1 ${inputClass}`}
                      placeholder="Contoh: 201234567890"
                      value={whatsappNumber}
                      onChange={(event) => setWhatsappNumber(onlyDigits(event.target.value))}
                    />
                    <p className="mt-1 text-[12px] font-normal leading-4 text-muted-foreground">
                      Pembeli menghubungimu lewat WhatsApp, jadi nomor ini wajib
                      diisi. Pakai kode negara tanpa tanda + (Mesir 20, Indonesia
                      62). Nomor ini tersimpan di profilmu untuk iklan berikutnya.
                    </p>
                  </div>
                )}

                <div>
                  <label className={labelClass} htmlFor="price">
                    {selectedKind === "produk" ? "Harga" : "Harga Awal / Estimasi Biaya"}
                  </label>
                  <div className="mt-1 flex gap-2">
                    <select
                      aria-label="Mata uang"
                      className="h-11 w-32 shrink-0 rounded-input border border-border bg-white px-3 text-[14px] text-charcoal focus:border-cta focus:outline-none focus:ring-3 focus:ring-cta/10"
                      value={form.currency}
                      onChange={(event) =>
                        updateForm("currency", event.target.value as CurrencyCode)
                      }
                    >
                      {currencyOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <input
                      id="price"
                      inputMode="numeric"
                      className={inputClass}
                      placeholder={selectedKind === "produk" ? "350.000" : "75.000"}
                      value={formatThousands(form.priceAmount)}
                      onChange={(event) =>
                        updateForm("priceAmount", onlyDigits(event.target.value))
                      }
                    />
                  </div>
                </div>

                {selectedKind === "produk" ? (
                  <>
                    <div>
                      <p className={labelClass}>Kondisi</p>
                      <div className="mt-2 flex gap-2">
                        {conditionOptions.map((condition) => {
                          const isActive = form.condition === condition;
                          return (
                            <button
                              key={condition}
                              type="button"
                              onClick={() => updateForm("condition", condition)}
                              aria-pressed={isActive}
                              className={`h-9 rounded-pill border px-4 text-[14px] font-bold transition-colors ${
                                isActive
                                  ? "border-charcoal bg-charcoal text-white"
                                  : "border-border bg-transparent text-charcoal hover:bg-surface"
                              }`}
                            >
                              {condition}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <label className={labelClass} htmlFor="deliveryMethod">
                        Metode Penyerahan
                      </label>
                      <select
                        id="deliveryMethod"
                        className={`mt-1 ${inputClass}`}
                        value={form.deliveryMethod}
                        onChange={(event) => updateForm("deliveryMethod", event.target.value)}
                      >
                        <option value="" disabled>
                          Pilih metode penyerahan
                        </option>
                        {deliveryOptions.map((method) => (
                          <option key={method} value={method}>
                            {method}
                          </option>
                        ))}
                      </select>
                    </div>

                    <PhotoUploader
                      id="photos"
                      label="Foto Produk"
                      photos={form.photos}
                      onChange={(photos) => updateForm("photos", photos)}
                    />
                  </>
                ) : (
                  <>
                    <div>
                      <label className={labelClass} htmlFor="scope">
                        Cakupan Layanan
                      </label>
                      <input
                        id="scope"
                        className={`mt-1 ${inputClass}`}
                        placeholder="Contoh: Online & tatap muka"
                        value={form.scope}
                        onChange={(event) => updateForm("scope", event.target.value)}
                      />
                    </div>

                    <div>
                      <label className={labelClass} htmlFor="estimatedDuration">
                        Estimasi Pengerjaan
                      </label>
                      <input
                        id="estimatedDuration"
                        className={`mt-1 ${inputClass}`}
                        placeholder="Contoh: 1-2 hari kerja"
                        value={form.estimatedDuration}
                        onChange={(event) =>
                          updateForm("estimatedDuration", event.target.value)
                        }
                      />
                    </div>

                    <PhotoUploader
                      id="portfolio"
                      label="Portofolio (opsional)"
                      photos={form.photos}
                      onChange={(photos) => updateForm("photos", photos)}
                    />
                  </>
                )}
              </form>

              <div className="mt-6 flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="h-11 flex-1 rounded-pill border border-border-strong text-base font-bold text-charcoal transition-colors hover:bg-surface"
                >
                  Kembali
                </button>
                <button
                  type="button"
                  disabled={!canContinueStep2}
                  onClick={() => setStep(3)}
                  className="h-11 flex-1 rounded-pill bg-charcoal text-base font-bold text-white transition-colors hover:bg-black disabled:bg-muted disabled:text-[#707070] disabled:hover:bg-muted"
                >
                  Lanjutkan
                </button>
              </div>
            </>
          )}

          {step === 3 && selectedKind && selectedCategory && !published && (
            <>
              <h2 className="text-xl font-bold text-charcoal">Konfirmasi & Publikasi</h2>
              <p className="mt-1 text-[14px] font-normal text-muted-foreground">
                Langkah 3 dari 3: periksa kembali detail iklanmu sebelum dipublikasikan.
              </p>

              <div className="mt-6 rounded-card border border-border-subtle bg-white p-6">
                <div className="flex items-center justify-between">
                  <span className="rounded-badge bg-highlight px-3 py-1 text-[12px] leading-4 font-bold text-white">
                    {selectedCategory}
                  </span>
                  <span className="rounded-badge bg-charcoal/80 px-3 py-1 text-[12px] leading-4 font-bold text-white">
                    {selectedKind === "produk" ? "Produk" : "Jasa"}
                  </span>
                </div>

                <h3 className="mt-4 text-xl font-normal leading-[26px] text-charcoal">
                  {form.title}
                </h3>
                <p className="mt-1 text-base font-bold text-cta">{priceLabel}</p>
                <p className="mt-3 text-[14px] font-normal text-muted-foreground">
                  {resolvedLocation}
                </p>

                <div className="mt-4 grid grid-cols-1 gap-3 border-t border-border-subtle pt-4 sm:grid-cols-2">
                  {selectedKind === "produk" ? (
                    <>
                      <div>
                        <p className={labelClass}>Kondisi</p>
                        <p className="mt-1 text-base text-charcoal">{form.condition}</p>
                      </div>
                      <div>
                        <p className={labelClass}>Metode Penyerahan</p>
                        <p className="mt-1 text-base text-charcoal">
                          {form.deliveryMethod}
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <p className={labelClass}>Cakupan Layanan</p>
                        <p className="mt-1 text-base text-charcoal">{form.scope}</p>
                      </div>
                      <div>
                        <p className={labelClass}>Estimasi Pengerjaan</p>
                        <p className="mt-1 text-base text-charcoal">
                          {form.estimatedDuration}
                        </p>
                      </div>
                    </>
                  )}
                </div>

                <div className="mt-4 border-t border-border-subtle pt-4">
                  <p className={labelClass}>Deskripsi</p>
                  <DescriptionText
                    value={form.description}
                    className="mt-1 text-base font-normal leading-6 text-charcoal"
                  />
                </div>

                {form.photos.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {form.photos.map((photo) => (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        key={photo.previewUrl}
                        src={photo.previewUrl}
                        alt={photo.file.name}
                        className="h-16 w-16 rounded-input object-cover"
                      />
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-4 rounded-card border border-border-subtle bg-surface/50 px-4 py-3">
                <p className="text-[14px] font-normal text-charcoal">
                  Iklan ini akan menggunakan slot posting gratis pertamamu. Iklan
                  akan langsung tayang setelah dipublikasikan, kecuali sistem
                  mendeteksi hal yang mencurigakan. Dalam kasus itu, iklan akan
                  ditinjau otomatis oleh admin dulu.
                </p>
              </div>

              {publishError && (
                <div className="mt-4 rounded-card border border-error/40 bg-error/5 px-4 py-3">
                  <p className="text-[14px] font-normal text-error">{publishError}</p>
                </div>
              )}

              <div className="mt-6 flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  disabled={publishing}
                  className="h-11 flex-1 rounded-pill border border-border-strong text-base font-bold text-charcoal transition-colors hover:bg-surface disabled:opacity-60"
                >
                  Edit
                </button>
                <button
                  type="button"
                  disabled={publishing}
                  onClick={handlePublish}
                  className="h-11 flex-1 rounded-pill bg-charcoal text-base font-bold text-white transition-colors hover:bg-black disabled:opacity-60"
                >
                  {publishing ? "Mempublikasikan..." : "Publikasikan"}
                </button>
              </div>
            </>
          )}

          {step === 3 && published && (
            <div className="flex flex-col items-center rounded-card border border-border-subtle bg-white p-10 text-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-success/10 text-2xl text-success">
                ✓
              </span>
              <h2 className="mt-4 text-xl font-bold text-charcoal">
                Iklan Berhasil Dipublikasikan
              </h2>
              <p className="mt-2 max-w-sm text-[14px] font-normal text-muted-foreground">
                {publishedStatus === "Menunggu Validasi"
                  ? "Iklanmu sedang ditinjau otomatis sebelum tayang di halaman Eksplor. Kamu bisa memantau statusnya di Iklan Saya."
                  : "Iklanmu sudah tayang di halaman Eksplor sekarang."}
              </p>

              <div className="mt-6 flex w-full max-w-xs gap-3">
                <Link
                  href="/jelajahi"
                  className="flex h-11 flex-1 items-center justify-center rounded-pill border border-border-strong text-base font-bold text-charcoal transition-colors hover:bg-surface"
                >
                  Ke Eksplor
                </Link>
                <Link
                  href="/iklan-saya"
                  className="flex h-11 flex-1 items-center justify-center rounded-pill bg-charcoal text-base font-bold text-white transition-colors hover:bg-black"
                >
                  Iklan Saya
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>

      {showQuotaModal && (
        <QuotaExceededModal
          message="Slot pasang iklan gratis kamu sudah kepakai. Upgrade paket buat dapat slot tambahan dan lanjut pasang iklan."
          onClose={() => setShowQuotaModal(false)}
        />
      )}
    </>
  );
}
