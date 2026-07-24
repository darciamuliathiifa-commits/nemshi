// Lightweight heuristic filter that replaces mandatory manual admin review
// (PRD originally required every ad to be validated before going live — the
// user found that "ribet" and asked for an automated filter instead). Ads
// that pass go live immediately as 'Aktif'; only ones this flags land in
// 'Menunggu Validasi' for a human to check.

const BLOCKED_KEYWORDS = [
  "judi",
  "slot gacor",
  "togel",
  "pinjol ilegal",
  "investasi bodong",
  "http://",
  "https://",
  "bit.ly",
  "klik link",
  "transfer dulu",
  "menang pasti",
];

export interface AdFilterInput {
  title: string;
  description: string;
  priceLabel: string;
}

export interface AdFilterResult {
  flagged: boolean;
  reasons: string[];
}

export function evaluateAdSubmission(input: AdFilterInput): AdFilterResult {
  const title = input.title.trim();
  const description = input.description.trim();
  const text = `${title} ${description}`.toLowerCase();
  const reasons: string[] = [];

  if (title.length < 5) {
    reasons.push("Judul terlalu pendek");
  }
  if (description.length < 15) {
    reasons.push("Deskripsi terlalu pendek");
  }
  if (!/\d/.test(input.priceLabel)) {
    reasons.push("Harga tidak mengandung angka");
  }

  for (const keyword of BLOCKED_KEYWORDS) {
    if (text.includes(keyword)) {
      reasons.push(`Indikasi spam: "${keyword}"`);
    }
  }

  const letters = [...title].filter((char) => /[a-zA-Z]/.test(char));
  const upperLetters = letters.filter((char) => char >= "A" && char <= "Z");
  if (letters.length >= 8 && upperLetters.length / letters.length > 0.7) {
    reasons.push("Judul didominasi huruf kapital");
  }

  return { flagged: reasons.length > 0, reasons };
}
