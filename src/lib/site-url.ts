/**
 * Absolute origin for this deployment, used as `metadataBase` so relative
 * Open Graph paths resolve to real URLs. Crawlers (WhatsApp, Facebook,
 * Twitter) reject relative image paths, so without this a shared link renders
 * with no preview image at all.
 *
 * Set NEXT_PUBLIC_SITE_URL to the custom domain in production — the Vercel
 * fallback points at the *.vercel.app host, which still previews but shows the
 * wrong domain to anyone inspecting the link.
 */
export function getSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) return explicit.replace(/\/+$/, "");

  // Set by Vercel to the project's production domain, without a protocol.
  const vercelDomain = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercelDomain) return `https://${vercelDomain}`;

  return "http://localhost:3000";
}

/**
 * Fallback preview image for pages with no image of their own.
 *
 * Deliberately not banner-nemsy.png: at 3MB that's far above the size where
 * WhatsApp quietly drops the preview. This one is ~200KB.
 */
export const DEFAULT_OG_IMAGE = {
  url: "/nemsy-logo-fix.png",
  width: 2964,
  height: 1122,
  alt: "Nemsy! — portal iklan baris Masisir",
};
