export function formatPriceLabel(
  priceType: "Range" | "Contact",
  priceMin: number | null,
  priceMax: number | null
): string {
  if (priceType === "Contact" || priceMin == null || priceMax == null) {
    return "Hubungi untuk Harga";
  }
  const format = (value: number) => `EGP ${value.toLocaleString("id-ID")}`;
  if (priceMin === priceMax) return format(priceMin);
  return `${format(priceMin)} - ${format(priceMax)}`;
}

export function formatRupiah(amount: number): string {
  return `Rp${amount.toLocaleString("id-ID")}`;
}

/** "2 jam yang lalu" untuk waktu dekat, tanggal lengkap jika lebih dari 7 hari. */
export function formatRelativeTime(date: Date | string): string {
  const target = typeof date === "string" ? new Date(date) : date;
  const diffMs = Date.now() - target.getTime();
  const diffMinutes = Math.floor(diffMs / (60 * 1000));

  if (diffMinutes < 1) return "Baru saja";
  if (diffMinutes < 60) return `${diffMinutes} menit yang lalu`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours} jam yang lalu`;

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays} hari yang lalu`;

  return target.toLocaleString("id-ID");
}

export function verificationLabel(status: string): string | null {
  if (status === "Identity_Verified") return "Identitas Terverifikasi";
  if (status === "Skill_Verified") return "Keahlian Terverifikasi";
  return null;
}
