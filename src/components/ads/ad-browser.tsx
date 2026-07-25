"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Ad, AdCategory } from "@/lib/types";
import { AdCard } from "@/components/ads/ad-card";
import { FeaturedCarousel } from "@/components/ads/featured-carousel";
import {
  BookIcon,
  BoxIcon,
  ChevronRightIcon,
  GridIcon,
  MapPinIcon,
  MegaphoneIcon,
  SearchIcon,
  SparklesIcon,
  TagIcon,
  UtensilsIcon,
} from "@/components/icons";

const categories: AdCategory[] = [
  "Pendidikan",
  "Makanan & Minuman",
  "Kreatif & Digital",
  "Bantuan & Layanan Harian",
  "Barang Baru & Bekas",
  "Lainnya",
];

const categoryIcons: Record<AdCategory, (props: { width?: number; height?: number; className?: string }) => React.ReactElement> = {
  Pendidikan: BookIcon,
  "Makanan & Minuman": UtensilsIcon,
  "Kreatif & Digital": SparklesIcon,
  "Bantuan & Layanan Harian": MegaphoneIcon,
  "Barang Baru & Bekas": BoxIcon,
  Lainnya: TagIcon,
};

function SidebarRow({
  icon: Icon,
  label,
  count,
  active,
  onClick,
}: {
  icon?: (props: { width?: number; height?: number; className?: string }) => React.ReactElement;
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`flex w-full items-center justify-between gap-2 rounded-input px-3 py-2.5 text-left text-[14px] font-bold transition-colors ${
        active ? "bg-charcoal text-white" : "text-charcoal hover:bg-surface"
      }`}
    >
      <span className="flex items-center gap-2.5">
        {Icon && <Icon width={16} height={16} />}
        {label}
      </span>
      <span
        className={`rounded-badge px-2 py-0.5 text-[11px] font-bold ${
          active ? "bg-white/20 text-white" : "bg-surface text-charcoal"
        }`}
      >
        {count}
      </span>
    </button>
  );
}

export function AdBrowser({ ads }: { ads: Ad[] }) {
  const [activeCategory, setActiveCategory] = useState<AdCategory | "Semua">(
    "Semua",
  );
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("Semua Lokasi");

  const featuredAds = useMemo(() => ads.filter((ad) => ad.featured), [ads]);

  const locations = useMemo(
    () => Array.from(new Set(ads.map((ad) => ad.location))).sort(),
    [ads],
  );

  const categoryCounts = useMemo(() => {
    const counts = new Map<AdCategory, number>();
    for (const ad of ads) {
      counts.set(ad.category, (counts.get(ad.category) ?? 0) + 1);
    }
    return counts;
  }, [ads]);

  const locationCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const ad of ads) {
      counts.set(ad.location, (counts.get(ad.location) ?? 0) + 1);
    }
    return counts;
  }, [ads]);

  const filteredAds = useMemo(() => {
    const normalizedKeyword = keyword.trim().toLowerCase();

    return ads.filter((ad) => {
      const matchesCategory =
        activeCategory === "Semua" || ad.category === activeCategory;
      const matchesLocation = location === "Semua Lokasi" || ad.location === location;
      const matchesKeyword =
        normalizedKeyword === "" ||
        ad.title.toLowerCase().includes(normalizedKeyword) ||
        ad.description.toLowerCase().includes(normalizedKeyword);

      return matchesCategory && matchesLocation && matchesKeyword;
    });
  }, [ads, activeCategory, location, keyword]);

  return (
    <main className="flex-1 px-6 py-8">
      <section className="relative overflow-hidden rounded-card border-[2.5px] border-ink bg-gradient-to-br from-brand-dark to-brand bg-dot-pattern shadow-[5px_5px_0_0_rgba(20,20,20,1)]">
        <div className="relative flex h-[180px] items-center justify-center overflow-hidden sm:h-[220px]">
          <span
            aria-hidden
            className="select-none whitespace-nowrap text-[110px] font-black leading-none tracking-tight text-white/15 sm:text-[170px]"
          >
            Eksplor
          </span>
        </div>

        <div className="relative -mt-8 mx-4 mb-4 flex flex-col gap-4 rounded-card border-[2.5px] border-ink bg-white p-5 shadow-[3px_3px_0_0_rgba(20,20,20,1)] sm:mx-6 sm:mb-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-bold text-charcoal sm:text-2xl">
              Temukan Semua yang Kamu Butuhkan
            </h1>
            <p className="mt-1 text-[14px] font-normal text-muted-foreground">
              Produk dan jasa dari komunitas Masisir, langsung terhubung via
              WhatsApp.
            </p>
          </div>

          <label className="relative w-full sm:max-w-xs sm:shrink-0">
            <SearchIcon
              width={16}
              height={16}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-charcoal/50"
            />
            <input
              type="search"
              placeholder="Cari di Nemshi..."
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
              className="h-11 w-full rounded-pill border-2 border-ink bg-white pl-11 pr-4 text-[14px] font-normal text-charcoal placeholder:text-charcoal/40 focus:outline-none focus:ring-3 focus:ring-cta/10"
            />
          </label>
        </div>
      </section>

      <div className="mt-8">
        <FeaturedCarousel ads={featuredAds} />
      </div>

      <Link
        href="/sayembara"
        className="mb-8 flex flex-col items-start justify-between gap-4 rounded-card border-[2.5px] border-ink bg-white p-6 shadow-[3px_3px_0_0_rgba(20,20,20,1)] transition-transform hover:-translate-y-1 sm:flex-row sm:items-center"
      >
        <div className="flex items-center gap-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand text-charcoal">
            <MegaphoneIcon width={22} height={22} />
          </span>
          <div>
            <h3 className="text-base font-bold text-charcoal">
              Butuh bantuan tapi belum nemu jasanya?
            </h3>
            <p className="mt-0.5 text-[14px] font-normal text-muted-foreground">
              Pasang Sayembara, biarkan komunitas Masisir yang menawarkan
              bantuan ke kamu.
            </p>
          </div>
        </div>
        <span className="flex h-10 shrink-0 items-center gap-1.5 rounded-pill bg-charcoal px-5 text-[14px] font-bold text-white">
          Lihat Sayembara
          <ChevronRightIcon width={16} height={16} />
        </span>
      </Link>

      <div className="mb-6">
        <h2 className="text-xl font-bold text-charcoal">Iklan Terbaru</h2>
        <p className="mt-1 text-[14px] font-normal text-muted-foreground">
          Produk dan jasa terbaru dari komunitas Masisir.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[240px_1fr] lg:items-start">
        <aside className="flex max-h-[500px] flex-col gap-6 overflow-y-auto rounded-card border-[2.5px] border-ink bg-white p-5 shadow-[3px_3px_0_0_rgba(20,20,20,1)] [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:sticky lg:top-24">
          <div>
            <p className="px-3 text-[12px] font-bold text-muted-foreground">Kategori</p>
            <div className="mt-2 flex flex-col gap-1">
              <SidebarRow
                icon={GridIcon}
                label="Semua Produk"
                count={ads.length}
                active={activeCategory === "Semua"}
                onClick={() => setActiveCategory("Semua")}
              />
              {categories.map((category) => (
                <SidebarRow
                  key={category}
                  icon={categoryIcons[category]}
                  label={category}
                  count={categoryCounts.get(category) ?? 0}
                  active={activeCategory === category}
                  onClick={() => setActiveCategory(category)}
                />
              ))}
            </div>
          </div>

          {locations.length > 0 && (
            <div className="border-t border-border-subtle pt-4">
              <p className="px-3 text-[12px] font-bold text-muted-foreground">Lokasi</p>
              <div className="mt-2 flex flex-col gap-1">
                <SidebarRow
                  icon={MapPinIcon}
                  label="Semua Lokasi"
                  count={ads.length}
                  active={location === "Semua Lokasi"}
                  onClick={() => setLocation("Semua Lokasi")}
                />
                {locations.map((loc) => (
                  <SidebarRow
                    key={loc}
                    icon={MapPinIcon}
                    label={loc}
                    count={locationCounts.get(loc) ?? 0}
                    active={location === loc}
                    onClick={() => setLocation(loc)}
                  />
                ))}
              </div>
            </div>
          )}
        </aside>

        <div>
          <div className="mb-4">
            <p className="text-[14px] font-normal text-muted-foreground">
              {filteredAds.length} iklan ditemukan.
            </p>
          </div>

          {filteredAds.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {filteredAds.map((ad) => (
                <AdCard key={ad.id} ad={ad} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-card border border-dashed border-border-strong py-16 text-center">
              <p className="text-base font-normal text-charcoal">
                Iklan tidak ditemukan.
              </p>
              <p className="mt-1 text-[14px] font-normal text-muted-foreground">
                Coba ubah kata kunci, kategori, atau lokasi pencarian.
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
