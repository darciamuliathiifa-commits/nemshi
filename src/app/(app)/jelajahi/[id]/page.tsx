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

export const revalidate = 30;

const categoryAccent: Record<string, string> = {
  Pendidikan: "from-blue-100 to-blue-50",
  "Makanan & Minuman": "from-amber-100 to-amber-50",
  "Kreatif & Digital": "from-violet-100 to-violet-50",
  "Bantuan & Layanan Harian": "from-emerald-100 to-emerald-50",
  "Barang Baru & Bekas": "from-rose-100 to-rose-50",
  Lainnya: "from-zinc-100 to-zinc-50",
};

const statusAccent: Record<string, string> = {
  Aktif: "bg-success text-white",
  Terjual: "bg-charcoal text-white",
  Selesai: "bg-charcoal text-white",
  Kedaluwarsa: "bg-muted text-white",
  Ditutup: "bg-error text-white",
};

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
  created_at: string;
  profiles: SellerProfileRow | SellerProfileRow[] | null;
  ad_photos: { url: string; position: number }[] | null;
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
    .select("title, description, price_label")
    .eq("id", id)
    .maybeSingle();

  if (!data) return { title: "Iklan tidak ditemukan | Nemsy!" };

  const title = `${data.title} · ${data.price_label} | Nemsy!`;
  const description = data.description.slice(0, 160);

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: ["/nemsy-logo-fix.png"],
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
       whatsapp_number, created_at,
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

  const whatsappHref = `https://wa.me/${ad.whatsappNumber}?text=${encodeURIComponent(
    `Halo, saya tertarik dengan iklan "${ad.title}" di Nemsy!`,
  )}`;

  const { data: relatedRows } = await supabase
    .from("ads")
    .select("id, kind, title, category, price_label, location")
    .eq("category", row.category)
    .eq("status", "Aktif")
    .or(`expires_at.is.null,expires_at.gt.${new Date().toISOString()}`)
    .neq("id", row.id)
    .order("created_at", { ascending: false })
    .limit(4);

  const related = relatedRows ?? [];

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
              <p className="mt-2 text-2xl font-bold text-cta">{ad.priceLabel}</p>

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
                <p className="mt-2 text-base font-normal leading-6 text-charcoal">
                  {ad.description}
                </p>
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

              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 flex h-11 w-full items-center justify-center rounded-pill bg-charcoal text-base font-bold text-white transition-colors hover:bg-black"
              >
                Hubungi via WhatsApp
              </a>

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
