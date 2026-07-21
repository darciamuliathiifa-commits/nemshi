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

export function verificationLabel(status: string): string | null {
  if (status === "Identity_Verified") return "Identitas Terverifikasi";
  if (status === "Skill_Verified") return "Keahlian Terverifikasi";
  return null;
}
