"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { PRODUCT_LABELS, PRODUCT_PRICES, type OrderProductType } from "@/lib/pricing";
import { formatRupiah } from "@/lib/format";

const PRODUCT_DESCRIPTIONS: Record<OrderProductType, string> = {
  Iklan_Tawarkan_Jasa: "Publikasikan iklan jasamu, tayang 30 hari setelah lolos moderasi.",
  Cari_Jasa_Prioritas: "Permintaan jasamu tampil menonjol (pin to top) selama 3 hari.",
  Paket_Plus: "3 kuota Iklan Tawarkan Jasa + 2 kuota Cari Jasa Prioritas, berlaku 90 hari.",
  Traktir_Platform: "Donasi sukarela sebagai apresiasi untuk pengembangan layanan Nemshi.",
};

export default function BayarPage() {
  const router = useRouter();
  const [loadingProduct, setLoadingProduct] = useState<OrderProductType | null>(null);

  async function handlePilih(productType: OrderProductType) {
    setLoadingProduct(productType);
    const response = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productType }),
    });
    const order = await response.json();
    router.push(`/bayar/${order.id}`);
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-2 text-2xl font-bold text-text">Beli Produk Promosi</h1>
      <p className="mb-6 text-text-secondary">
        Platform Nemshi tidak menjual jasa antar pengguna — hanya ruang iklan dan exposure.
      </p>

      <div className="flex flex-col gap-3">
        {(Object.keys(PRODUCT_LABELS) as OrderProductType[]).map((productType) => (
          <div
            key={productType}
            className="flex items-center justify-between gap-4 rounded-xl border border-black/5 bg-white p-5"
          >
            <div>
              <h2 className="font-semibold text-text">{PRODUCT_LABELS[productType]}</h2>
              <p className="text-sm text-text-secondary">{PRODUCT_DESCRIPTIONS[productType]}</p>
              <p className="mt-1 font-semibold text-primary">
                {formatRupiah(PRODUCT_PRICES[productType])}
              </p>
            </div>
            <button
              onClick={() => handlePilih(productType)}
              disabled={loadingProduct !== null}
              className="shrink-0 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
            >
              {loadingProduct === productType ? "Memproses..." : "Pilih"}
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}
