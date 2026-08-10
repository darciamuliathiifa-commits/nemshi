"use client";

import { useEffect, useState } from "react";
import { AD_CATEGORIES, type AdCategory, type AdKind } from "@/lib/types";
import { CloseIcon } from "@/components/icons";
import { DescriptionEditor } from "@/components/forms/description-editor";
import { isVariablePriceLabel, VARIABLE_PRICE_LABEL } from "@/lib/format-currency";

interface AdminEditAdDialogProps {
  adId: string | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (updated: {
    id: string;
    title: string;
    category: AdCategory;
    priceLabel: string;
    location: string;
  }) => void;
}

interface AdminAdDetail {
  id: string;
  kind: AdKind;
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
}

export function AdminEditAdDialog({
  adId,
  isOpen,
  onClose,
  onSuccess,
}: AdminEditAdDialogProps) {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [detail, setDetail] = useState<AdminAdDetail | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<AdCategory>("Pendidikan");
  const [priceLabel, setPriceLabel] = useState("");
  const [variablePrice, setVariablePrice] = useState(false);
  const [location, setLocation] = useState("");
  const [condition, setCondition] = useState<"Baru" | "Bekas">("Bekas");
  const [deliveryMethod, setDeliveryMethod] = useState("");
  const [scope, setScope] = useState("");
  const [estimatedDuration, setEstimatedDuration] = useState("");

  useEffect(() => {
    if (!isOpen || !adId) return;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    setError(null);

    fetch(`/api/admin/ads/${adId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Gagal mengambil data iklan.");
        return res.json();
      })
      .then((data: AdminAdDetail) => {
        setDetail(data);
        setTitle(data.title ?? "");
        setDescription(data.description ?? "");
        setCategory(data.category ?? "Pendidikan");
        const variable = isVariablePriceLabel(data.priceLabel);
        setPriceLabel(variable ? "" : data.priceLabel ?? "");
        setVariablePrice(variable);
        setLocation(data.location ?? "");
        setCondition(data.condition ?? "Bekas");
        setDeliveryMethod(data.deliveryMethod ?? "");
        setScope(data.scope ?? "");
        setEstimatedDuration(data.estimatedDuration ?? "");
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : "Gagal memuat iklan.");
      })
      .finally(() => setLoading(false));
  }, [isOpen, adId]);

  if (!isOpen || !adId) return null;

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
    if (!variablePrice && priceLabel.trim() === "") {
      setError('Label harga wajib diisi, atau centang "Harga bervariasi".');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const finalPriceLabel = variablePrice ? VARIABLE_PRICE_LABEL : priceLabel;

      const res = await fetch(`/api/admin/ads/${adId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          category,
          priceLabel: finalPriceLabel,
          location,
          condition: detail?.kind === "produk" ? condition : undefined,
          deliveryMethod: detail?.kind === "produk" ? deliveryMethod : undefined,
          scope: detail?.kind === "jasa" ? scope : undefined,
          estimatedDuration: detail?.kind === "jasa" ? estimatedDuration : undefined,
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
      <button
        type="button"
        aria-label="Tutup dialog"
        onClick={onClose}
        className="absolute inset-0 bg-ink/50 backdrop-blur-sm"
      />

      <div className="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-card border-[2.5px] border-ink bg-white p-6 shadow-[5px_5px_0_0_rgba(20,20,20,1)]">
        <div className="flex items-center justify-between border-b border-border-subtle pb-4">
          <h2 className="text-xl font-bold text-charcoal">Edit Iklan (Admin)</h2>
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
              <label htmlFor="admin-edit-title" className="text-[12px] font-bold text-muted-foreground">
                Judul Iklan
              </label>
              <input
                id="admin-edit-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="mt-1 h-11 w-full rounded-input border border-border bg-white px-3 text-[14px] text-charcoal focus:border-cta focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="admin-edit-category" className="text-[12px] font-bold text-muted-foreground">
                Kategori
              </label>
              <select
                id="admin-edit-category"
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
                <label htmlFor="admin-edit-price" className="text-[12px] font-bold text-muted-foreground">
                  Label Harga
                </label>

                <label className="mt-1 flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={variablePrice}
                    onChange={(e) => setVariablePrice(e.target.checked)}
                    className="h-4 w-4 rounded border-border text-cta focus:ring-cta/30"
                  />
                  <span className="text-[13px] font-normal text-charcoal">
                    Harga bervariasi
                  </span>
                </label>

                {variablePrice ? (
                  <p className="mt-2 text-[13px] font-normal text-muted-foreground">
                    Akan ditampilkan sebagai &ldquo;Harga bervariasi&rdquo;.
                  </p>
                ) : (
                  <input
                    id="admin-edit-price"
                    type="text"
                    value={priceLabel}
                    onChange={(e) => setPriceLabel(e.target.value)}
                    placeholder="cth. Rp 150.000 atau Gratis"
                    className="mt-2 h-11 w-full rounded-input border border-border bg-white px-3 text-[14px] text-charcoal focus:border-cta focus:outline-none"
                  />
                )}
              </div>

              <div>
                <label htmlFor="admin-edit-location" className="text-[12px] font-bold text-muted-foreground">
                  Lokasi
                </label>
                <input
                  id="admin-edit-location"
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="cth. Hay Asyir, Kairo"
                  required
                  className="mt-1 h-11 w-full rounded-input border border-border bg-white px-3 text-[14px] text-charcoal focus:border-cta focus:outline-none"
                />
              </div>
            </div>

            {detail?.kind === "produk" && (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="admin-edit-condition" className="text-[12px] font-bold text-muted-foreground">
                    Kondisi Barang
                  </label>
                  <select
                    id="admin-edit-condition"
                    value={condition}
                    onChange={(e) => setCondition(e.target.value as "Baru" | "Bekas")}
                    className="mt-1 h-11 w-full rounded-input border border-border bg-white px-3 text-[14px] text-charcoal focus:border-cta focus:outline-none"
                  >
                    <option value="Baru">Baru</option>
                    <option value="Bekas">Bekas</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="admin-edit-delivery" className="text-[12px] font-bold text-muted-foreground">
                    Metode Pengiriman
                  </label>
                  <input
                    id="admin-edit-delivery"
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
                  <label htmlFor="admin-edit-scope" className="text-[12px] font-bold text-muted-foreground">
                    Jangkauan Layanan
                  </label>
                  <input
                    id="admin-edit-scope"
                    type="text"
                    value={scope}
                    onChange={(e) => setScope(e.target.value)}
                    placeholder="cth. Online / Area Kairo"
                    className="mt-1 h-11 w-full rounded-input border border-border bg-white px-3 text-[14px] text-charcoal focus:border-cta focus:outline-none"
                  />
                </div>

                <div>
                  <label htmlFor="admin-edit-duration" className="text-[12px] font-bold text-muted-foreground">
                    Estimasi Waktu Pengerjaan
                  </label>
                  <input
                    id="admin-edit-duration"
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
              <label htmlFor="admin-edit-desc" className="text-[12px] font-bold text-muted-foreground">
                Deskripsi Iklan
              </label>
              <DescriptionEditor
                id="admin-edit-desc"
                rows={4}
                value={description}
                onChange={setDescription}
                required
                className="mt-1"
              />
            </div>

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
