"use client";

import { useEffect, useState } from "react";
import { AD_CATEGORIES, type AdCategory } from "@/lib/types";
import { CloseIcon } from "@/components/icons";
import { PhotoUploader } from "@/components/forms/photo-uploader";
import { FocalPointPicker } from "@/components/ads/focal-point-picker";
import { isVariablePriceLabel, VARIABLE_PRICE_LABEL } from "@/lib/format-currency";
import { DescriptionEditor } from "@/components/forms/description-editor";
import { uploadPhotos, type UploadedPhoto } from "@/lib/upload";
import type { MyAd } from "@/components/ads/my-ads-list";

interface EditAdDialogProps {
  adId: string | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (updatedAd: Partial<MyAd>) => void;
}

interface AdDetail {
  id: string;
  kind: "produk" | "jasa";
  title: string;
  description: string;
  category: AdCategory;
  priceLabel: string;
  location: string;
  status: string;
  condition?: "Baru" | "Bekas";
  deliveryMethod?: string;
  scope?: string;
  estimatedDuration?: string;
  photos: string[];
  coverFocalPoint?: string;
  socialMedia?: string;
  address?: string;
}

type PriceMode = "fixed" | "variable" | "none";

export function EditAdDialog({
  adId,
  isOpen,
  onClose,
  onSuccess,
}: EditAdDialogProps) {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [detail, setDetail] = useState<AdDetail | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<AdCategory>("Pendidikan");
  const [priceLabel, setPriceLabel] = useState("");
  const [priceMode, setPriceMode] = useState<PriceMode>("fixed");
  const [location, setLocation] = useState("");
  const [address, setAddress] = useState("");
  const [socialMedia, setSocialMedia] = useState("");
  const [condition, setCondition] = useState<"Baru" | "Bekas">("Bekas");
  const [deliveryMethod, setDeliveryMethod] = useState("");
  const [scope, setScope] = useState("");
  const [estimatedDuration, setEstimatedDuration] = useState("");
  const [photos, setPhotos] = useState<UploadedPhoto[]>([]);
  const [existingPhotos, setExistingPhotos] = useState<string[]>([]);
  const [coverFocalPoint, setCoverFocalPoint] = useState("50% 0%");

  useEffect(() => {
    if (!isOpen || !adId) return;

    // This reset belongs to the dialog-open transition, before the async request begins.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    setError(null);

    fetch(`/api/my-ads/${adId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Gagal mengambil data iklan.");
        return res.json();
      })
      .then((data: AdDetail) => {
        setDetail(data);
        setTitle(data.title ?? "");
        setDescription(data.description ?? "");
        setCategory(data.category ?? "Pendidikan");
        const mode: PriceMode = isVariablePriceLabel(data.priceLabel)
          ? "variable"
          : (data.priceLabel ?? "").trim() === ""
            ? "none"
            : "fixed";
        setPriceMode(mode);
        setPriceLabel(mode === "fixed" ? data.priceLabel ?? "" : "");
        setLocation(data.location ?? "");
        setAddress(data.address ?? "");
        setSocialMedia(data.socialMedia ?? "");
        setCondition(data.condition ?? "Bekas");
        setDeliveryMethod(data.deliveryMethod ?? "");
        setScope(data.scope ?? "");
        setEstimatedDuration(data.estimatedDuration ?? "");
        setExistingPhotos(data.photos ?? []);
        setPhotos([]);
        setCoverFocalPoint(data.coverFocalPoint ?? "50% 0%");
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : "Gagal memuat iklan.");
      })
      .finally(() => setLoading(false));
  }, [isOpen, adId]);

  if (!isOpen || !adId) return null;

  function removeExistingPhoto(index: number) {
    setExistingPhotos((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!adId) return;

    if (title.trim().length < 5) {
      setError("Judul iklan minimal 5 karakter.");
      return;
    }
    if (description.trim().length < 15) {
      setError("Deskripsi iklan minimal 15 karakter.");
      return;
    }
    if (priceMode === "fixed" && priceLabel.trim() === "") {
      setError('Label harga wajib diisi, atau pilih "Harga bervariasi"/"Tanpa harga".');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const newUploadedPhotoUrls = await uploadPhotos(photos);
      const allPhotoUrls = [...existingPhotos, ...newUploadedPhotoUrls];
      const finalPriceLabel =
        priceMode === "variable" ? VARIABLE_PRICE_LABEL : priceMode === "none" ? "" : priceLabel;

      const res = await fetch(`/api/my-ads/${adId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          category,
          priceLabel: finalPriceLabel,
          location,
          address,
          condition: detail?.kind === "produk" ? condition : undefined,
          deliveryMethod: detail?.kind === "produk" ? deliveryMethod : undefined,
          scope: detail?.kind === "jasa" ? scope : undefined,
          estimatedDuration: detail?.kind === "jasa" ? estimatedDuration : undefined,
          photos: allPhotoUrls,
          coverFocalPoint,
          socialMedia,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.error ?? "Gagal menyimpan perubahan iklan.");
      }

      onSuccess({
        id: adId,
        title: data.title ?? title,
        category: data.category ?? category,
        priceLabel: data.priceLabel ?? finalPriceLabel,
        location: data.location ?? location,
        status: data.status,
        coverFocalPoint: data.coverFocalPoint ?? coverFocalPoint,
      });
      onClose();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Gagal menyimpan perubahan iklan.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Tutup dialog"
        onClick={onClose}
        className="absolute inset-0 bg-ink/50 backdrop-blur-sm"
      />

      {/* Modal Card */}
      <div className="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-card border-[2.5px] border-ink bg-white p-6 shadow-[5px_5px_0_0_rgba(20,20,20,1)]">
        <div className="flex items-center justify-between border-b border-border-subtle pb-4">
          <h2 className="text-xl font-bold text-charcoal">Edit Iklan Saya</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup dialog"
            className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-ink bg-white text-charcoal hover:bg-surface"
          >
            <CloseIcon width={16} height={16} />
          </button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <span className="h-8 w-8 animate-spin rounded-full border-4 border-surface border-t-cta" />
            <p className="mt-3 text-[14px] font-bold text-muted-foreground">
              Memuat data iklan...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-4">
            {error && (
              <div className="rounded-input border-2 border-ink bg-error/10 p-3 text-[14px] font-bold text-error">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="edit-title" className="text-[12px] font-bold text-muted-foreground">
                Judul Iklan
              </label>
              <input
                id="edit-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="mt-1 h-11 w-full rounded-input border border-border bg-white px-3 text-[14px] text-charcoal focus:border-cta focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="edit-category" className="text-[12px] font-bold text-muted-foreground">
                Kategori
              </label>
              <select
                id="edit-category"
                value={category}
                onChange={(e) => setCategory(e.target.value as AdCategory)}
                className="mt-1 h-11 w-full rounded-input border border-border bg-white px-3 text-[14px] text-charcoal focus:border-cta focus:outline-none"
              >
                {AD_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="edit-price" className="text-[12px] font-bold text-muted-foreground">
                  Label Harga
                </label>

                <div className="mt-1 flex flex-wrap gap-2">
                  {(
                    [
                      { value: "fixed", label: "Ada harga" },
                      { value: "variable", label: "Harga bervariasi" },
                      { value: "none", label: "Tanpa harga" },
                    ] as { value: PriceMode; label: string }[]
                  ).map((option) => {
                    const isActive = priceMode === option.value;
                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setPriceMode(option.value)}
                        aria-pressed={isActive}
                        className={`h-8 rounded-pill border px-3 text-[12px] font-bold transition-colors ${
                          isActive
                            ? "border-charcoal bg-charcoal text-white"
                            : "border-border bg-transparent text-charcoal hover:bg-surface"
                        }`}
                      >
                        {option.label}
                      </button>
                    );
                  })}
                </div>

                {priceMode === "variable" && (
                  <p className="mt-2 text-[13px] font-normal text-muted-foreground">
                    Akan ditampilkan sebagai &ldquo;Harga bervariasi&rdquo;.
                  </p>
                )}

                {priceMode === "none" && (
                  <p className="mt-2 text-[13px] font-normal text-muted-foreground">
                    Harga nggak akan ditampilkan sama sekali.
                  </p>
                )}

                {priceMode === "fixed" && (
                  <input
                    id="edit-price"
                    type="text"
                    value={priceLabel}
                    onChange={(e) => setPriceLabel(e.target.value)}
                    placeholder="cth. Rp 150.000 atau Gratis"
                    className="mt-2 h-11 w-full rounded-input border border-border bg-white px-3 text-[14px] text-charcoal focus:border-cta focus:outline-none"
                  />
                )}
              </div>

              <div>
                <label htmlFor="edit-location" className="text-[12px] font-bold text-muted-foreground">
                  Lokasi
                </label>
                <input
                  id="edit-location"
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="cth. Hay Asyir, Kairo"
                  required
                  className="mt-1 h-11 w-full rounded-input border border-border bg-white px-3 text-[14px] text-charcoal focus:border-cta focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label htmlFor="edit-address" className="text-[12px] font-bold text-muted-foreground">
                Alamat Lengkap (opsional)
              </label>
              <input
                id="edit-address"
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Contoh: Jl. Thoha Dinari, Imaroh 26, dekat Masjid X"
                className="mt-1 h-11 w-full rounded-input border border-border bg-white px-3 text-[14px] text-charcoal focus:border-cta focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="edit-social" className="text-[12px] font-bold text-muted-foreground">
                Media Sosial (opsional)
              </label>
              <input
                id="edit-social"
                type="text"
                value={socialMedia}
                onChange={(e) => setSocialMedia(e.target.value)}
                placeholder="Contoh: instagram.com/namaakun atau @namaakun"
                className="mt-1 h-11 w-full rounded-input border border-border bg-white px-3 text-[14px] text-charcoal focus:border-cta focus:outline-none"
              />
            </div>

            {detail?.kind === "produk" && (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="edit-condition" className="text-[12px] font-bold text-muted-foreground">
                    Kondisi Barang
                  </label>
                  <select
                    id="edit-condition"
                    value={condition}
                    onChange={(e) => setCondition(e.target.value as "Baru" | "Bekas")}
                    className="mt-1 h-11 w-full rounded-input border border-border bg-white px-3 text-[14px] text-charcoal focus:border-cta focus:outline-none"
                  >
                    <option value="Baru">Baru</option>
                    <option value="Bekas">Bekas</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="edit-delivery" className="text-[12px] font-bold text-muted-foreground">
                    Metode Pengiriman
                  </label>
                  <input
                    id="edit-delivery"
                    type="text"
                    value={deliveryMethod}
                    onChange={(e) => setDeliveryMethod(e.target.value)}
                    placeholder="cth. COD / Antar Kos"
                    className="mt-1 h-11 w-full rounded-input border border-border bg-white px-3 text-[14px] text-charcoal focus:border-cta focus:outline-none"
                  />
                </div>
              </div>
            )}

            {detail?.kind === "jasa" && (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="edit-scope" className="text-[12px] font-bold text-muted-foreground">
                    Jangkauan Layanan
                  </label>
                  <input
                    id="edit-scope"
                    type="text"
                    value={scope}
                    onChange={(e) => setScope(e.target.value)}
                    placeholder="cth. Online / Area Kairo"
                    className="mt-1 h-11 w-full rounded-input border border-border bg-white px-3 text-[14px] text-charcoal focus:border-cta focus:outline-none"
                  />
                </div>

                <div>
                  <label htmlFor="edit-duration" className="text-[12px] font-bold text-muted-foreground">
                    Estimasi Waktu Pengerjaan
                  </label>
                  <input
                    id="edit-duration"
                    type="text"
                    value={estimatedDuration}
                    onChange={(e) => setEstimatedDuration(e.target.value)}
                    placeholder="cth. 1-2 hari kerja"
                    className="mt-1 h-11 w-full rounded-input border border-border bg-white px-3 text-[14px] text-charcoal focus:border-cta focus:outline-none"
                  />
                </div>
              </div>
            )}

            <div>
              <label htmlFor="edit-desc" className="text-[12px] font-bold text-muted-foreground">
                Deskripsi Iklan
              </label>
              <DescriptionEditor
                id="edit-desc"
                rows={4}
                value={description}
                onChange={setDescription}
                required
                className="mt-1"
              />
            </div>

            {/* Existing Photos */}
            {existingPhotos.length > 0 && (
              <div>
                <p className="text-[12px] font-bold text-muted-foreground">
                  Foto Saat Ini
                </p>
                <div className="mt-2 flex flex-wrap gap-3">
                  {existingPhotos.map((url, idx) => (
                    <div
                      key={url}
                      className="relative h-20 w-20 overflow-hidden rounded-input border border-border-subtle"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={url}
                        alt={`Foto ${idx + 1}`}
                        className="h-full w-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeExistingPhoto(idx)}
                        aria-label="Hapus foto ini"
                        className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-ink/70 text-white"
                      >
                        <CloseIcon width={12} height={12} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Add New Photos */}
            <PhotoUploader
              id="edit-photos"
              label="Tambah Foto Baru (Opsional)"
              photos={photos}
              onChange={setPhotos}
            />

            {(existingPhotos[0] || photos[0]?.previewUrl) && (
              <FocalPointPicker
                imageUrl={existingPhotos[0] ?? photos[0]?.previewUrl ?? ""}
                value={coverFocalPoint}
                onChange={setCoverFocalPoint}
              />
            )}

            <div className="mt-4 flex items-center justify-end gap-3 border-t border-border-subtle pt-4">
              <button
                type="button"
                onClick={onClose}
                disabled={saving}
                className="h-10 rounded-pill border-2 border-ink bg-white px-5 text-[14px] font-bold text-charcoal transition-colors hover:bg-surface disabled:opacity-50"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex h-10 items-center justify-center gap-2 rounded-pill bg-charcoal px-6 text-[14px] font-bold text-white transition-colors hover:bg-black disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                    Menyimpan...
                  </>
                ) : (
                  "Simpan Perubahan"
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
