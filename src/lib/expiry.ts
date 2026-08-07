// How many days before expiry the cron sends its heads-up, and how early the
// "Perpanjang" button starts showing on a still-active listing. These are the
// same number on purpose: a reminder that lands before the button appears
// sends people to a page with nothing to click.
export const EXPIRY_REMINDER_DAYS = 2;

/**
 * Whole days from now until `expiresAt`, rounded up so the last partial day
 * still reads as "1 hari lagi" rather than "0". Returns null when the listing
 * never expires (master account) or has no expiry set.
 */
export function daysUntilExpiry(expiresAt: string | null | undefined): number | null {
  if (!expiresAt) return null;

  const remainingMs = new Date(expiresAt).getTime() - Date.now();
  if (Number.isNaN(remainingMs)) return null;

  return Math.ceil(remainingMs / (24 * 60 * 60 * 1000));
}

/** Short label for the countdown shown on "Iklan Saya" cards. */
export function formatExpiryLabel(expiresAt: string | null | undefined): string | null {
  const days = daysUntilExpiry(expiresAt);
  if (days === null) return null;
  if (days <= 0) return "Masa tayang habis";
  if (days === 1) return "Berakhir besok";
  return `Berakhir ${days} hari lagi`;
}

/**
 * Whether a still-active listing is close enough to expiry that the owner
 * should be offered a renewal.
 */
export function isNearingExpiry(expiresAt: string | null | undefined): boolean {
  const days = daysUntilExpiry(expiresAt);
  return days !== null && days <= EXPIRY_REMINDER_DAYS;
}
