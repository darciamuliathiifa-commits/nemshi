"use client";

import { useState } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { PhotoUploader } from "@/components/forms/photo-uploader";
import { uploadPhotos, type UploadedPhoto } from "@/lib/upload";
import type { AdCategory, AdCondition, AdKind } from "@/lib/types";

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

const conditionOptions: AdCondition[] = ["Baru", "Bekas"];
const deliveryOptions = ["COD", "Antar Jemput", "Lainnya"];

const inputClass =
  "h-11 w-full rounded-input border border-border bg-white px-4 text-[14px] text-charcoal placeholder:text-muted focus:border-cta focus:outline-none focus:ring-3 focus:ring-cta/10";
const labelClass = "text-[12px] font-bold text-muted-foreground";

interface FormState {
  title: string;
  description: string;
  location: string;
  price: string;
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
  price: "",
  condition: "",
  deliveryMethod: "",
  scope: "",
  estimatedDuration: "",
  photos: [],
};

export default function PasangIklanPage() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [published, setPublished] = useState(false);
  const [publishedPhotoUrls, setPublishedPhotoUrls] = useState<string[]>([]);
  const [selectedKind, setSelectedKind] = useState<AdKind | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<AdCategory | null>(null);
  const [form, setForm] = useState<FormState>(initialForm);

  const canContinueStep1 = selectedKind !== null && selectedCategory !== null;

  const canContinueStep2 =
    form.title.trim() !== "" &&
    form.description.trim() !== "" &&
    form.location.trim() !== "" &&
    (selectedKind === "produk"
      ? form.price.trim() !== "" && form.condition !== "" && form.deliveryMethod !== ""
      : form.price.trim() !== "" && form.scope.trim() !== "" && form.estimatedDuration.trim() !== "");

  function updateForm<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <>
      <Header title="Pasang Iklan" />

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
                Langkah 1 dari 3 — tentukan jenis iklan dan kategorinya.
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
                <div className="mt-3 flex flex-wrap gap-2">
                  {categoryOptions.map((category) => {
                    const isActive = selectedCategory === category;
                    return (
                      <button
                        key={category}
                        type="button"
                        onClick={() => setSelectedCategory(category)}
                        aria-pressed={isActive}
                        className={`h-9 rounded-pill border px-4 text-[14px] font-bold transition-colors ${
                          isActive
                            ? "border-charcoal bg-charcoal text-white"
                            : "border-border bg-transparent text-charcoal hover:bg-surface"
                        }`}
                      >
                        {category}
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
                Langkah 2 dari 3 — lengkapi detail iklan {selectedKind} kategori{" "}
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
                  <textarea
                    id="description"
                    rows={4}
                    className={`mt-1 ${inputClass} h-auto resize-none py-3`}
                    placeholder="Jelaskan detail produk atau jasa yang kamu tawarkan"
                    value={form.description}
                    onChange={(event) => updateForm("description", event.target.value)}
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
                    value={form.location}
                    onChange={(event) => updateForm("location", event.target.value)}
                  />
                </div>

                {selectedKind === "produk" ? (
                  <>
                    <div>
                      <label className={labelClass} htmlFor="price">
                        Harga (EGP/Rp)
                      </label>
                      <input
                        id="price"
                        className={`mt-1 ${inputClass}`}
                        placeholder="Contoh: Rp 350.000"
                        value={form.price}
                        onChange={(event) => updateForm("price", event.target.value)}
                      />
                    </div>

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
                      <label className={labelClass} htmlFor="price">
                        Harga Awal / Estimasi Biaya
                      </label>
                      <input
                        id="price"
                        className={`mt-1 ${inputClass}`}
                        placeholder="Contoh: Mulai Rp 75.000"
                        value={form.price}
                        onChange={(event) => updateForm("price", event.target.value)}
                      />
                    </div>

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
                Langkah 3 dari 3 — periksa kembali detail iklanmu sebelum dipublikasikan.
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
                <p className="mt-1 text-base font-bold text-cta">{form.price}</p>
                <p className="mt-3 text-[14px] font-normal text-muted-foreground">
                  {form.location}
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
                  <p className="mt-1 text-base font-normal leading-6 text-charcoal">
                    {form.description}
                  </p>
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
                  Iklan ini akan menggunakan slot posting gratis pertamamu. Iklan akan
                  tayang setelah divalidasi oleh admin.
                </p>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="h-11 flex-1 rounded-pill border border-border-strong text-base font-bold text-charcoal transition-colors hover:bg-surface"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    const urls = await uploadPhotos(form.photos);
                    setPublishedPhotoUrls(urls);
                    setPublished(true);
                  }}
                  className="h-11 flex-1 rounded-pill bg-charcoal text-base font-bold text-white transition-colors hover:bg-black"
                >
                  Publikasikan
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
                Iklan Berhasil Dikirim
              </h2>
              <p className="mt-2 max-w-sm text-[14px] font-normal text-muted-foreground">
                Iklanmu sedang menunggu validasi admin sebelum tayang di halaman
                Eksplor. Kamu bisa memantau statusnya di Iklan Saya.
              </p>
              {publishedPhotoUrls.length > 0 && (
                <p className="mt-2 text-[12px] text-muted-foreground">
                  {publishedPhotoUrls.length} foto berhasil diunggah.
                </p>
              )}

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
    </>
  );
}
