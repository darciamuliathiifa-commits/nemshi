export type AdCategory =
  | "Pendidikan"
  | "Makanan & Minuman"
  | "Kreatif & Digital"
  | "Bantuan & Layanan Harian"
  | "Barang Baru & Bekas"
  | "Perjalanan & Travel"
  | "Titipan & Bagasi"
  | "Komunitas & Organisasi"
  | "Lainnya";

export const AD_CATEGORIES: AdCategory[] = [
  "Pendidikan",
  "Makanan & Minuman",
  "Kreatif & Digital",
  "Bantuan & Layanan Harian",
  "Barang Baru & Bekas",
  "Perjalanan & Travel",
  "Titipan & Bagasi",
  "Komunitas & Organisasi",
  "Lainnya",
];

export type AdKind = "produk" | "jasa";

export type AdStatus = "Aktif" | "Menunggu Validasi" | "Terjual" | "Selesai" | "Kedaluwarsa" | "Ditutup";

export type AdCondition = "Baru" | "Bekas";

export interface Ad {
  id: string;
  kind: AdKind;
  title: string;
  category: AdCategory;
  priceLabel: string;
  location: string;
  status: AdStatus;
  postedAt: string;
  sellerName: string;
  sellerJoinedYear: number;
  sellerActiveAds: number;
  whatsappNumber: string;
  description: string;
  condition?: AdCondition;
  deliveryMethod?: string;
  scope?: string;
  estimatedDuration?: string;
  createdAt?: string;
  coverPhoto?: string;
  coverFocalPoint?: string;
  photos?: string[];
  featured?: boolean;
}
