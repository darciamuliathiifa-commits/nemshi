import { Suspense } from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/header";
import { MapPinIcon, UserIcon } from "@/components/icons";
import { ShareButton } from "@/components/ads/share-button";
import { SaveButton } from "@/components/ads/save-button";
import { ReportAdDialog } from "@/components/ads/report-ad-dialog";
import { createSupabasePublicClient } from "@/lib/supabase/public";
import { formatRelativeTime } from "@/lib/format-relative-time";
import { TransactionDisclaimer } from "@/components/shared/transaction-disclaimer";
import { AdGallery } from "@/components/ads/ad-gallery";
import { DescriptionText } from "@/components/shared/description-text";
import { stripDescriptionFormatting } from "@/lib/description-format";
import { SEED_OWNER_IDS } from "@/lib/constants";
import { DEFAULT_OG_IMAGE } from "@/lib/site-url";

export const revalidate = 30;

interface SellerProfileRow {
  id: string;
  name: string;
  whatsapp_number: string | null;
  location: string | null;
  created_at: string;
}

interface AdDetailRow {
  id: string;
  owner_id: string;
  kind: "produk" | "jasa";
  title: string;
  description: string;
  category: string;
  price_label: string;
  location: string;
  status: string;
  condition: string | null;
  delivery_method: string | null;
  scope: string | null;
  estimated_duration: string | null;
  whatsapp_number: string | null;
  social_media: string | null;
  created_at: string;
  profiles: SellerProfileRow | SellerProfileRow[] | null;
  ad_photos: { url: string; position: number }[] | null;
}

function socialMediaHref(value: string): string {
  const trimmed = value.trim();
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  const handle = trimmed.replace(/^@/, "");
  return `https://instagram.com/${handle}`;
}

async function ActiveAdsCount({ ownerId }: { ownerId: string }) {
  const supabase = createSupabasePublicClient();
  if (!supabase) return <>0 iklan aktif</>;

  const { count } = await supabase
    .from("ads")
    .select("id", { count: "exact", head: true })
    .eq("owner_id", ownerId)
    .eq("status", "Aktif")
    .or(`expires_at.is.null,expires_at.gt.${new Date().toISOString()}`);

  return <>{count ?? 0} iklan aktif</>;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;

  const supabase = createSupabasePublicClient();
  if (!supabase) return { title: "Nemsy!" };

  const { data } = await supabase
    .from("ads")
    .select("title, description, price_label, ad_photos ( url, position )")
    .eq("id", id)
    .maybeSingle();

  if (!data) return { title: "Iklan tidak ditemukan | Nemsy!" };

  const title = `${data.title} · ${data.price_label} | Nemsy!`;
  const description = stripDescriptionFormatting(data.description).slice(0, 160);

  // Nearly every share happens by pasting the link into a WhatsApp group, so
  // the preview image is the listing's real shop window — show the item, not
  // the Nemsy logo. Storage URLs are already absolute, so metadataBase doesn't
  // apply to them.
  const photos = ((data.ad_photos ?? []) as { url: string; position: number }[])
    .slice()
    .sort((a, b) => a.position - b.position);

  const images = photos.length > 0
    ? [{ url: photos[0].url, alt: data.title }]
    : [DEFAULT_OG_IMAGE];

  return {
    title,
    description,
    openGraph: {
      type: "article",
      siteName: "Nemsy!",
      locale: "id_ID",
      title,
      description,
      url: `/jelajahi/${id}`,
      images,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [images[0].url],
    },
  };
}

export default async function AdDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabase = createSupabasePublicClient();
  if (!supabase) {
    notFound();
  }

  const { data } = await supabase
    .from("ads")
    .select(
      `id, owner_id, kind, title, description, category, price_label, location,
       status, condition, delivery_method, scope, estimated_duration,
       whatsapp_number, social_media, created_at,
       profiles!owner_id ( id, name, whatsapp_number, location, created_at ),
       ad_photos ( url, position )`,
    )
    .eq("id", id)
    .maybeSingle();

  if (!data) {
    notFound();
  }

  const row = data as unknown as AdDetailRow;
  const profile = Array.isArray(row.profiles) ? row.profiles[0] : row.profiles;

  const photos = (row.ad_photos ?? [])
    .slice()
    .sort((a, b) => a.position - b.position)
    .map((photo) => photo.url);

  const ad = {
    id: row.id,
    kind: row.kind,
    title: row.title,
    description: row.description,
    category: row.category,
    priceLabel: row.price_label,
    location: row.location,
    status: row.status,
    postedAt: formatRelativeTime(row.created_at),
    condition: row.condition,
    deliveryMethod: row.delivery_method,
    scope: row.scope,
    estimatedDuration: row.estimated_duration,
    whatsappNumber: row.whatsapp_number ?? profile?.whatsapp_number ?? "",
    socialMedia: row.social_media ?? "",
    sellerId: row.owner_id,
    sellerName: profile?.name ?? "Pengguna Nemsy!",
    sellerJoinedYear: profile
      ? new Date(profile.created_at).getFullYear()
      : new Date().getFullYear(),
  };

  const detailItems =
    ad.kind === "produk"
      ? [
          { label: "Kondisi", value: ad.condition },
          { label: "Metode Penyerahan", value: ad.deliveryMethod },
        ]
      : [
          { label: "Cakupan Layanan", value: ad.scope },
          { label: "Estimasi Pengerjaan", value: ad.estimatedDuration },
        ];

  // An empty number would render as "https://wa.me/?text=…", which opens
  // WhatsApp with no recipient — a button that looks fine and goes nowhere.
  const hasWhatsapp = Boolean(ad.whatsappNumber?.trim());
  const whatsappHref = `https://wa.me/${ad.whatsappNumber}?text=${encodeURIComponent(
    `Halo, saya tertarik dengan iklan "${ad.title}" di Nemsy!`,
  )}`;

  // Same category alone is a loose match (a design-service ad and a used
  // motorbike ad can share "Lainnya"). Try same kind + a shared title
  // keyword first, then backfill with same kind + category by recency so
  // the section still fills up to 4 when nothing matches closely.
  const titleKeywords = Array.from(
    new Set(
      row.title
        .toLowerCase()
        .split(/[^a-z0-9]+/i)
        .filter((word) => word.length >= 3),
    ),
  ).slice(0, 6);

  const notSeed = `(${SEED_OWNER_IDS.join(",")})`;
  const stillLive = `expires_at.is.null,expires_at.gt.${new Date().toISOString()}`;

  let related: {
    id: string;
    kind: string;
    title: string;
    category: string;
    price_label: string;
    location: string;
  }[] = [];

  if (titleKeywords.length > 0) {
    const { data: keywordMatches } = await supabase
      .from("ads")
      .select("id, kind, title, category, price_label, location")
      .eq("kind", row.kind)
      .eq("category", row.category)
      .eq("status", "Aktif")
      .not("owner_id", "in", notSeed)
      .or(stillLive)
      .or(titleKeywords.map((word) => `title.ilike.%${word}%`).join(","))
      .neq("id", row.id)
      .order("created_at", { ascending: false })
      .limit(4);

    related = keywordMatches ?? [];
  }

  if (related.length < 4) {
    const excludeIds = `(${[row.id, ...related.map((item) => item.id)].join(",")})`;
    const { data: fallbackMatches } = await supabase
      .from("ads")
      .select("id, kind, title, category, price_label, location")
      .eq("kind", row.kind)
      .eq("category", row.category)
      .eq("status", "Aktif")
      .not("owner_id", "in", notSeed)
      .or(stillLive)
      .not("id", "in", excludeIds)
      .order("created_at", { ascending: false })
      .limit(4 - related.length);

    related = [...related, ...(fallbackMatches ?? [])];
  }

  return (
    <>
      <Header title="Detail Iklan" />

      <main className="flex-1 px-6 py-10">
        <Link
          href="/jelajahi"
          className="mb-6 inline-flex items-center text-[14px] font-bold text-cta hover:text-highlight"
        >
          ← Kembali ke Eksplor
        </Link>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[520px_1fr] lg:items-start">
          <AdGallery
            photos={photos}
            title={ad.title}
            category={ad.category}
            kind={ad.kind}
            status={ad.status}
          />

          <div className="flex flex-col gap-6">
            <div className="rounded-card border-[2.5px] border-ink bg-white p-6 shadow-[3px_3px_0_0_rgba(20,20,20,1)] sm:p-8">
              <h2 className="text-2xl leading-[30px] font-bold text-charcoal">
                {ad.title}
              </h2>
              {ad.priceLabel && (
                <p className="mt-2 text-2xl font-bold text-cta">{ad.priceLabel}</p>
              )}

              <div className="mt-3 flex items-center gap-1.5 text-[14px] font-normal text-muted-foreground">
                <MapPinIcon width={16} height={16} />
                <span>{ad.location}</span>
                <span className="mx-1">·</span>
                <span>Diposting {ad.postedAt}</span>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-4 border-t border-border-subtle pt-6 sm:grid-cols-2">
                {detailItems.map(
                  (item) =>
                    item.value && (
                      <div key={item.label}>
                        <p className="text-[12px] font-bold text-muted-foreground">
                          {item.label}
                        </p>
                        <p className="mt-1 text-base font-normal text-charcoal">
                          {item.value}
                        </p>
                      </div>
                    ),
                )}
              </div>

              <div className="mt-6 border-t border-border-subtle pt-6">
                <p className="text-[12px] font-bold text-muted-foreground">
                  Deskripsi
                </p>
                <DescriptionText
                  value={ad.description}
                  className="mt-2 text-base font-normal leading-6 text-charcoal"
                />
              </div>
            </div>

            <div className="rounded-card border-[2.5px] border-ink bg-white p-6 shadow-[3px_3px_0_0_rgba(20,20,20,1)]">
              <p className="text-[12px] font-bold text-muted-foreground">
                Pengiklan
              </p>
              <Link
                href={`/profil/${ad.sellerId}`}
                className="mt-3 flex items-center gap-3 rounded-input p-2 -m-2 transition-colors hover:bg-surface"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-ink bg-cream text-ink">
                  <UserIcon width={22} height={22} />
                </div>
                <div>
                  <p className="text-base font-bold text-charcoal">
                    {ad.sellerName}
                  </p>
                  <p className="text-[13px] font-normal text-muted-foreground">
                    Bergabung sejak {ad.sellerJoinedYear} ·{" "}
                    <Suspense
                      fallback={
                        <span className="inline-block h-3 w-16 animate-pulse rounded bg-surface align-middle" />
                      }
                    >
                      <ActiveAdsCount ownerId={ad.sellerId} />
                    </Suspense>
                  </p>
                </div>
              </Link>

              {hasWhatsapp ? (
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 flex h-11 w-full items-center justify-center rounded-pill bg-charcoal text-base font-bold text-white transition-colors hover:bg-black"
                >
                  Hubungi via WhatsApp
                </a>
              ) : (
                <div className="mt-5 rounded-input border border-border bg-surface px-4 py-3 text-center">
                  <p className="text-[14px] font-bold text-charcoal">
                    Kontak belum tersedia
                  </p>
                  <p className="mt-0.5 text-[13px] font-normal leading-5 text-muted-foreground">
                    Penjual belum melengkapi nomor WhatsApp-nya.
                  </p>
                </div>
              )}

              {ad.socialMedia && (
                <a
                  href={socialMediaHref(ad.socialMedia)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2.5 flex h-11 w-full items-center justify-center rounded-pill border-2 border-ink text-base font-bold text-charcoal transition-colors hover:bg-surface"
                >
                  Lihat Media Sosial
                </a>
              )}

              <div className="mt-3 flex gap-2">
                <SaveButton adId={ad.id} />
                <ShareButton title={ad.title} />
              </div>
            </div>

            <div className="flex justify-center">
              <ReportAdDialog adTitle={ad.title} />
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <div className="mt-8">
            <h3 className="text-lg font-bold text-charcoal">Produk & Jasa Serupa</h3>
            <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((item) => (
                <Link
                  key={item.id}
                  href={`/jelajahi/${item.id}`}
                  className="flex flex-col gap-2 rounded-card border-[2.5px] border-ink bg-white p-4 shadow-[3px_3px_0_0_rgba(20,20,20,1)] transition-transform hover:-translate-y-0.5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="w-fit rounded-badge bg-highlight px-2.5 py-1 text-[11px] font-bold text-white">
                      {item.category}
                    </span>
                    <span className="w-fit rounded-badge bg-charcoal/80 px-2.5 py-1 text-[11px] font-bold text-white">
                      {item.kind === "produk" ? "Produk" : "Jasa"}
                    </span>
                  </div>
                  <h4 className="line-clamp-2 text-[14px] font-bold leading-5 text-charcoal">
                    {item.title}
                  </h4>
                  <span className="text-[13px] font-bold text-cta">
                    {item.price_label}
                  </span>
                  <span className="flex items-center gap-1 text-[12px] font-normal text-muted-foreground">
                    <MapPinIcon width={12} height={12} />
                    {item.location}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}

        <TransactionDisclaimer />
      </main>
    </>
  );
}
