import { AdBrowser } from "@/components/ads/ad-browser";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { formatRelativeTime } from "@/lib/format-relative-time";
import type { Ad } from "@/lib/types";

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
  profiles: SellerProfileRow | SellerProfileRow[] | null;
}

export default async function EksplorPage() {
  const supabase = await createSupabaseServerClient();
  let ads: Ad[] = [];

  if (supabase) {
    const { data } = await supabase
      .from("ads")
      .select(
        `id, owner_id, kind, title, description, category, price_label, location,
         status, condition, delivery_method, scope, estimated_duration,
         whatsapp_number, created_at,
         profiles ( id, name, whatsapp_number, created_at )`,
      )
      .eq("status", "Aktif")
      .order("created_at", { ascending: false });

    const rows = (data ?? []) as unknown as AdRow[];
    const ownerIds = Array.from(new Set(rows.map((row) => row.owner_id)));
    const activeAdsCountByOwner = new Map<string, number>();

    if (ownerIds.length > 0) {
      const { data: activeAdsRows } = await supabase
        .from("ads")
        .select("owner_id")
        .eq("status", "Aktif")
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
        sellerName: profile?.name ?? "Pengguna Nemshi",
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
        featured: false,
      };
    });
  }

  return <AdBrowser ads={ads} />;
}
