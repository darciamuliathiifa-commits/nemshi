import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/header";
import { MapPinIcon, UserIcon } from "@/components/icons";
import { ShareButton } from "@/components/ads/share-button";
import { SaveButton } from "@/components/ads/save-button";
import { ReportAdDialog } from "@/components/ads/report-ad-dialog";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { formatRelativeTime } from "@/lib/format-relative-time";

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
}

export default async function AdDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    notFound();
  }

  const { data } = await supabase
    .from("ads")
    .select(
      `id, owner_id, kind, title, description, category, price_label, location,
       status, condition, delivery_method, scope, estimated_duration,
       whatsapp_number, created_at,
       profiles!owner_id ( id, name, whatsapp_number, location, created_at )`,
    )
    .eq("id", id)
    .maybeSingle();

  if (!data) {
    notFound();
  }

  const row = data as unknown as AdDetailRow;
  const profile = Array.isArray(row.profiles) ? row.profiles[0] : row.profiles;

  const [{ data: photoRows }, { count: activeAdsCount }] = await Promise.all([
    supabase
      .from("ad_photos")
      .select("url")
      .eq("ad_id", row.id)
      .order("position", { ascending: true }),
    supabase
      .from("ads")
      .select("id", { count: "exact", head: true })
      .eq("owner_id", row.owner_id)
      .eq("status", "Aktif"),
  ]);

  const photos = (photoRows ?? []).map((photo) => photo.url);

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
    sellerName: profile?.name ?? "Pengguna Nemshi",
    sellerJoinedYear: profile
      ? new Date(profile.created_at).getFullYear()
      : new Date().getFullYear(),
    sellerActiveAds: activeAdsCount ?? 0,
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
    `Halo, saya tertarik dengan iklan "${ad.title}" di Nemshi.`,
  )}`;

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
          <div
            className={`relative aspect-[4/5] w-full overflow-hidden rounded-card border-[2.5px] border-ink bg-gradient-to-br shadow-[3px_3px_0_0_rgba(20,20,20,1)] ${categoryAccent[ad.category] ?? categoryAccent.Lainnya}`}
          >
            {photos.length > 0 && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={photos[0]}
                alt={ad.title}
                className="absolute inset-0 h-full w-full object-cover"
              />
            )}
            {photos.length > 0 && (
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            )}

            <div className="absolute inset-x-0 top-0 flex items-start justify-between p-5">
              <span className="rounded-badge bg-highlight px-3 py-1 text-[12px] leading-4 font-bold text-white">
                {ad.category}
              </span>
              <div className="flex flex-col items-end gap-2">
                <span className="rounded-badge bg-charcoal/80 px-3 py-1 text-[12px] leading-4 font-bold text-white">
                  {ad.kind === "produk" ? "Produk" : "Jasa"}
                </span>
                <span
                  className={`rounded-badge px-3 py-1 text-[12px] leading-4 font-bold ${statusAccent[ad.status] ?? statusAccent.Aktif}`}
                >
                  {ad.status}
                </span>
              </div>
            </div>

            {photos.length > 1 && (
              <div className="absolute inset-x-0 bottom-0 flex gap-2 overflow-x-auto p-4">
                {photos.slice(0, 5).map((url) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={url}
                    src={url}
                    alt=""
                    className="h-14 w-14 shrink-0 rounded-input border-2 border-white object-cover shadow-sm"
                  />
                ))}
              </div>
            )}
          </div>

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
                    {ad.sellerActiveAds} iklan aktif
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
      </main>
    </>
  );
}
