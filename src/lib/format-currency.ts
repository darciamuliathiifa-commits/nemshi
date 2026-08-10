export function formatThousands(digitsOnly: string): string {
  const cleaned = digitsOnly.replace(/\D/g, "");
  if (!cleaned) return "";
  return cleaned.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

export function onlyDigits(value: string): string {
  return value.replace(/\D/g, "");
}

export type CurrencyCode = "IDR" | "EGP" | "USD";

export const currencyOptions: { value: CurrencyCode; label: string; prefix: string }[] = [
  { value: "IDR", label: "Rupiah", prefix: "Rp " },
  { value: "EGP", label: "EGP", prefix: "EGP " },
  { value: "USD", label: "Dollar USD", prefix: "$" },
];

export function composePriceLabel(currency: CurrencyCode, amountDigits: string): string {
  const prefix = currencyOptions.find((option) => option.value === currency)?.prefix ?? "";
  return amountDigits ? `${prefix}${formatThousands(amountDigits)}` : "";
}

// A product with several price variants doesn't have one number to show —
// the label just becomes this fixed text instead of forcing a nominal in.
export const VARIABLE_PRICE_LABEL = "Harga bervariasi";

export function isVariablePriceLabel(label: string | null | undefined): boolean {
  return (label ?? "").trim() === VARIABLE_PRICE_LABEL;
}

export function parsePriceLabel(
  label: string | null | undefined,
): { currency: CurrencyCode; amount: string } {
  const trimmed = label?.trim();
  if (!trimmed) return { currency: "IDR", amount: "" };

  for (const option of currencyOptions) {
    const prefix = option.prefix.trim();
    if (trimmed.startsWith(prefix)) {
      return { currency: option.value, amount: onlyDigits(trimmed.slice(prefix.length)) };
    }
  }

  // Unrecognized format (e.g. free-text like "Nego") — best effort.
  return { currency: "IDR", amount: onlyDigits(trimmed) };
}
