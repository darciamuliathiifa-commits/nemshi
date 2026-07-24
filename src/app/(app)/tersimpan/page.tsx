"use client";

import { Header } from "@/components/layout/header";
import { AdCard } from "@/components/ads/ad-card";
import { useSavedAds } from "@/lib/saved-ads-store";
import { mockAds } from "@/lib/mock-ads";

export default function TersimpanPage() {
  const { savedIds } = useSavedAds();
  const savedAds = mockAds.filter((ad) => savedIds.includes(ad.id));

  return (
    <>
      <Header title="Iklan Tersimpan" />

      <main className="flex-1 px-6 py-8">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-charcoal">Iklan Tersimpan</h2>
          <p className="mt-1 text-[14px] font-normal text-muted-foreground">
            {savedAds.length} iklan yang kamu simpan untuk dilihat kembali.
          </p>
        </div>

        {savedAds.length > 0 ? (
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
