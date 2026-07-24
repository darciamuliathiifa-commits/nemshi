"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Ad, AdCategory } from "@/lib/types";
import { AdCard } from "@/components/ads/ad-card";
import { FeaturedCarousel } from "@/components/ads/featured-carousel";
import { Header } from "@/components/layout/header";
import {
  ChevronDownIcon,
  ChevronRightIcon,
  GridIcon,
  MapPinIcon,
  MegaphoneIcon,
} from "@/components/icons";

const categories: AdCategory[] = [
  "Pendidikan",
  "Makanan & Minuman",
  "Kreatif & Digital",
  "Bantuan & Layanan Harian",
  "Barang Baru & Bekas",
  "Lainnya",
];

function FilterSelect({
  icon: Icon,
  value,
  onChange,
  options,
  label,
}: {
  icon: (props: { width?: number; height?: number; className?: string }) => React.ReactElement;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  label: string;
}) {
  return (
    <label className="relative inline-flex items-center">
      <span className="sr-only">{label}</span>
      <Icon
        width={15}
        height={15}
        className="pointer-events-none absolute left-3.5 text-charcoal"
      />
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-10 appearance-none rounded-pill border-2 border-ink bg-white py-0 pl-9 pr-9 text-[14px] font-bold text-charcoal focus:outline-none focus:ring-3 focus:ring-cta/10"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <ChevronDownIcon
        width={14}
        height={14}
        className="pointer-events-none absolute right-3.5 text-charcoal"
      />
    </label>
  );
}

export function AdBrowser({ title, ads }: { title: string; ads: Ad[] }) {
  const [activeCategory, setActiveCategory] = useState<AdCategory | "Semua">(
    "Semua",
  );
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("Semua Lokasi");

  const featuredAds = useMemo(() => ads.filter((ad) => ad.featured), [ads]);

  const locations = useMemo(
    () => ["Semua Lokasi", ...Array.from(new Set(ads.map((ad) => ad.location))).sort()],
    [ads],
  );

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
    <>
      <Header title={title} searchValue={keyword} onSearchChange={setKeyword} />

      <main className="flex-1 px-6 py-8">
        <FeaturedCarousel ads={featuredAds} />

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

        <div className="mb-6 flex flex-wrap items-center gap-2.5">
          <FilterSelect
            icon={GridIcon}
            label="Kategori"
            value={activeCategory}
            onChange={(value) => setActiveCategory(value as AdCategory | "Semua")}
            options={["Semua", ...categories]}
          />
          <FilterSelect
            icon={MapPinIcon}
            label="Lokasi"
            value={location}
            onChange={setLocation}
            options={locations}
          />
        </div>

        <div className="mb-4">
          <p className="text-[14px] font-normal text-muted-foreground">
            {filteredAds.length} iklan ditemukan.
          </p>
        </div>

        {filteredAds.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
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
      </main>
    </>
  );
}
