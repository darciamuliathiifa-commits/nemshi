import { AdBrowser } from "@/components/ads/ad-browser";
import { createSupabasePublicClient } from "@/lib/supabase/public";
import { formatRelativeTime } from "@/lib/format-relative-time";
import type { Ad } from "@/lib/types";

// ISR: serve a cached version of the listing for up to 30s instead of
// blocking every page view on a fresh Supabase round-trip — cuts perceived
// load delay while keeping the listing reasonably fresh.
export const revalidate = 30;

interface SellerProfileRow {
  id: string;
  name: string;
  whatsapp_number: string | null;
  created_at: string;
}

interface AdRow {
  id: string;
  owner_id: string;
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
  featured_until: string | null;
  profiles: SellerProfileRow | SellerProfileRow[] | null;
}

export default async function EksplorPage() {
  const supabase = createSupabasePublicClient();
  let ads: Ad[] = [];

  if (supabase) {
    const { data } = await supabase
      .from("ads")
      .select(
        `id, owner_id, kind, title, description, category, price_label, location,
         status, condition, delivery_method, scope, estimated_duration,
         whatsapp_number, created_at, featured_until,
         profiles!owner_id ( id, name, whatsapp_number, created_at )`,
      )
      .eq("status", "Aktif")
      .or(`expires_at.is.null,expires_at.gt.${new Date().toISOString()}`)
      .order("created_at", { ascending: false });

    const rows = (data ?? []) as unknown as AdRow[];
    const ownerIds = Array.from(new Set(rows.map((row) => row.owner_id)));
    const activeAdsCountByOwner = new Map<string, number>();

    if (ownerIds.length > 0) {
      const { data: activeAdsRows } = await supabase
        .from("ads")
        .select("owner_id")
        .eq("status", "Aktif")
        .or(`expires_at.is.null,expires_at.gt.${new Date().toISOString()}`)
        .in("owner_id", ownerIds);

      for (const row of (activeAdsRows ?? []) as { owner_id: string }[]) {
        activeAdsCountByOwner.set(
          row.owner_id,
          (activeAdsCountByOwner.get(row.owner_id) ?? 0) + 1,
        );
      }
    }

    ads = rows.map((row) => {
      const profile = Array.isArray(row.profiles) ? row.profiles[0] : row.profiles;
      return {
        id: row.id,
        kind: row.kind,
        title: row.title,
        category: row.category,
        priceLabel: row.price_label,
        location: row.location,
        status: row.status,
        postedAt: formatRelativeTime(row.created_at),
        sellerName: profile?.name ?? "Pengguna Nemsy!",
        sellerJoinedYear: profile
          ? new Date(profile.created_at).getFullYear()
          : new Date().getFullYear(),
        sellerActiveAds: profile ? activeAdsCountByOwner.get(profile.id) ?? 0 : 0,
        whatsappNumber: row.whatsapp_number ?? profile?.whatsapp_number ?? "",
        description: row.description,
        condition: row.condition ?? undefined,
        deliveryMethod: row.delivery_method ?? undefined,
        scope: row.scope ?? undefined,
        estimatedDuration: row.estimated_duration ?? undefined,
        featured: !!row.featured_until && new Date(row.featured_until) > new Date(),
      };
    });
  }

  return <AdBrowser ads={ads} />;
}
