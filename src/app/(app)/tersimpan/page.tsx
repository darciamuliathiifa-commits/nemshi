"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/layout/header";
import { AdCard } from "@/components/ads/ad-card";
import { useSavedAds } from "@/lib/saved-ads-store";
import { supabase } from "@/lib/supabase/client";
import type { Ad } from "@/lib/types";
import { formatRelativeTime } from "@/lib/format-relative-time";
import { SEED_OWNER_IDS } from "@/lib/constants";

export default function TersimpanPage() {
  const { savedIds } = useSavedAds();
  const [savedAds, setSavedAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!savedIds || savedIds.length === 0) {
      setSavedAds([]);
      setLoading(false);
      return;
    }

    async function loadSavedAds() {
      setLoading(true);
      try {
        if (!supabase) {
          setSavedAds([]);
          return;
        }

        const { data } = await supabase
          .from("ads")
          .select(
            `id, kind, title, description, category, price_label, location, status,
             condition, delivery_method, scope, estimated_duration, whatsapp_number,
             created_at, owner_id,
             profiles!owner_id ( name, created_at ),
             ad_photos ( url, position )`,
          )
          .in("id", savedIds)
          .eq("status", "Aktif")
          .not("owner_id", "in", `(${SEED_OWNER_IDS.join(",")})`);

        if (data) {
          const ads: Ad[] = data.map((row: any) => {
            const profile = Array.isArray(row.profiles) ? row.profiles[0] : row.profiles;
            const photos = (row.ad_photos ?? [])
              .slice()
              .sort((a: any, b: any) => a.position - b.position)
              .map((p: any) => p.url);

            return {
              id: row.id,
              kind: row.kind,
              title: row.title,
              category: row.category,
              priceLabel: row.price_label,
              location: row.location,
              status: row.status,
              postedAt: formatRelativeTime(row.created_at),
              coverPhoto: photos[0] ?? undefined,
              photos,
              sellerName: profile?.name ?? "Pengguna Nemsy!",
              sellerJoinedYear: profile
                ? new Date(profile.created_at).getFullYear()
                : new Date().getFullYear(),
              sellerActiveAds: 1,
              whatsappNumber: row.whatsapp_number ?? "",
              description: row.description,
            };
          });
          setSavedAds(ads);
        }
      } catch (err) {
        console.error("Gagal memuat iklan tersimpan:", err);
      } finally {
        setLoading(false);
      }
    }

    loadSavedAds();
  }, [savedIds]);

  return (
    <>
      <Header title="Iklan Tersimpan" containerClassName="max-w-7xl" />

      <main className="flex-1 px-6 py-8">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-charcoal">Iklan Tersimpan</h2>
          <p className="mt-1 text-[14px] font-normal text-muted-foreground">
            {savedAds.length} iklan yang kamu simpan untuk dilihat kembali.
          </p>
        </div>

        {loading ? (
          <div className="flex h-40 items-center justify-center">
            <span className="h-8 w-8 animate-spin rounded-full border-4 border-surface border-t-cta" />
          </div>
        ) : savedAds.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {savedAds.map((ad) => (
              <AdCard key={ad.id} ad={ad} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-card border border-dashed border-border-strong py-16 text-center">
            <p className="text-base font-normal text-charcoal">
              Belum ada iklan yang disimpan.
            </p>
            <p className="mt-1 text-[14px] font-normal text-muted-foreground">
              Simpan iklan menarik dari halaman Eksplor untuk melihatnya di sini.
            </p>
          </div>
        )}
      </main>
    </>
  );
}
