import { notFound } from "next/navigation";
import { Header } from "@/components/layout/header";
import { UserIcon } from "@/components/icons";
import { AdCard } from "@/components/ads/ad-card";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { formatRelativeTime } from "@/lib/format-relative-time";
import type { Ad } from "@/lib/types";

interface AdRow {
  id: string;
  kind: "produk" | "jasa";
  title: string;
  description: string;
  category: Ad["category"];
  price_label: string;
  location: string;
  status: Ad["status"];
  condition: Ad["condition"] | null;
  delivery_method: string | null;
  scope: string | null;
  estimated_duration: string | null;
  whatsapp_number: string | null;
  created_at: string;
  cover_focal_point: string | null;
  ad_photos: { url: string; position: number }[] | null;
}

export default async function PublicProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    notFound();
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, name, whatsapp_number, created_at")
    .eq("id", id)
    .maybeSingle();

  if (!profile) {
    notFound();
  }

  const [{ data: adRows }, { count: activeAdsCount }] = await Promise.all([
    supabase
      .from("ads")
      .select(
        `id, kind, title, description, category, price_label, location, status,
         condition, delivery_method, scope, estimated_duration, whatsapp_number, created_at,
         cover_focal_point, ad_photos ( url, position )`,
      )
      .eq("owner_id", profile.id)
      .eq("status", "Aktif")
      .or(`expires_at.is.null,expires_at.gt.${new Date().toISOString()}`)
      .order("created_at", { ascending: false }),
    supabase
      .from("ads")
      .select("id", { count: "exact", head: true })
      .eq("owner_id", profile.id)
      .eq("status", "Aktif")
      .or(`expires_at.is.null,expires_at.gt.${new Date().toISOString()}`),
  ]);

  const joinedYear = new Date(profile.created_at).getFullYear();
  const rows = (adRows ?? []) as unknown as AdRow[];

  const ads: Ad[] = rows.map((row) => {
    const photos = (row.ad_photos ?? [])
      .slice()
      .sort((a, b) => a.position - b.position)
      .map((photo) => photo.url);

    return {
      id: row.id,
      kind: row.kind,
      title: row.title,
      category: row.category,
      priceLabel: row.price_label,
      location: row.location,
      status: row.status,
      postedAt: formatRelativeTime(row.created_at),
      sellerName: profile.name,
      sellerJoinedYear: joinedYear,
      sellerActiveAds: activeAdsCount ?? 0,
      whatsappNumber: row.whatsapp_number ?? profile.whatsapp_number ?? "",
      description: row.description,
      condition: row.condition ?? undefined,
      deliveryMethod: row.delivery_method ?? undefined,
      scope: row.scope ?? undefined,
      estimatedDuration: row.estimated_duration ?? undefined,
      coverPhoto: photos[0] ?? undefined,
      coverFocalPoint: row.cover_focal_point ?? "50% 0%",
      photos,
    };
  });

  return (
    <>
      <Header title="Profil Pengiklan" containerClassName="max-w-4xl" />

      <main className="flex-1 px-6 py-8">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-card border border-border-subtle bg-white p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-black/20 text-ink">
                <UserIcon width={28} height={28} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-charcoal">{profile.name}</h2>
                <p className="mt-1 text-[14px] font-normal text-muted-foreground">
                  Bergabung sejak {joinedYear} · {activeAdsCount ?? 0} iklan aktif
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-xl font-bold text-charcoal">
              Iklan dari {profile.name}
            </h3>
            <p className="mt-1 text-[14px] font-normal text-muted-foreground">
              {ads.length} iklan aktif.
            </p>

            {ads.length > 0 ? (
              <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {ads.map((ad) => (
                  <AdCard key={ad.id} ad={ad} />
                ))}
              </div>
            ) : (
              <div className="mt-4 flex flex-col items-center justify-center rounded-card border border-dashed border-border-strong py-16 text-center">
                <p className="text-base font-normal text-charcoal">
                  Belum ada iklan aktif.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
