export const PRODUCT_LABELS = {
  Iklan_Tawarkan_Jasa: "Iklan Tawarkan Jasa",
  Cari_Jasa_Prioritas: "Cari Jasa Prioritas",
  Paket_Plus: "Paket Plus",
  Traktir_Platform: "Traktir Platform",
} as const;

export type OrderProductType = keyof typeof PRODUCT_LABELS;

// Biaya tetap dalam Rupiah — model bisnis Nemshi berbasis biaya publikasi
// tetap, bukan komisi/persentase dari transaksi (lihat PRD bagian 2).
export const PRODUCT_PRICES: Record<OrderProductType, number> = {
  Iklan_Tawarkan_Jasa: 50_000,
  Cari_Jasa_Prioritas: 12_000,
  Paket_Plus: 150_000,
  Traktir_Platform: 5_000,
};

// Produk yang publikasinya melalui antrean moderasi admin, sehingga dana
// ditahan dulu sampai iklan disetujui/ditolak.
export const PRODUCTS_REQUIRING_MODERATION: OrderProductType[] = [
  "Iklan_Tawarkan_Jasa",
  "Cari_Jasa_Prioritas",
];

export function requiresModeration(productType: OrderProductType): boolean {
  return PRODUCTS_REQUIRING_MODERATION.includes(productType);
}
