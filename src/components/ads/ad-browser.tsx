"use client";

import { useLayoutEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { Ad, AdCategory } from "@/lib/types";
import { AdCard } from "@/components/ads/ad-card";
import { FeaturedCarousel } from "@/components/ads/featured-carousel";
import { HeroBanner } from "@/components/shared/hero-banner";
import { Pagination } from "@/components/shared/pagination";
import {
  BookIcon,
  BoxIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  CompassIcon,
  GridIcon,
  LuggageIcon,
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
  "Perjalanan & Travel",
  "Titipan & Bagasi",
  "Lainnya",
];

const categoryIcons: Record<AdCategory, (props: { width?: number; height?: number; className?: string }) => React.ReactElement> = {
  Pendidikan: BookIcon,
  "Makanan & Minuman": UtensilsIcon,
  "Kreatif & Digital": SparklesIcon,
  "Bantuan & Layanan Harian": MegaphoneIcon,
  "Barang Baru & Bekas": BoxIcon,
  "Perjalanan & Travel": CompassIcon,
  "Titipan & Bagasi": LuggageIcon,
  Lainnya: TagIcon,
};

const PAGE_SIZE = 20;

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

function FilterSection({
  title,
  open,
  onToggle,
  children,
}: {
  title: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-card border-[2.5px] border-ink bg-white shadow-[3px_3px_0_0_#006451]">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-2 p-5 text-left"
      >
        <span className="text-[12px] font-bold text-muted-foreground">{title}</span>
        <ChevronDownIcon
          width={16}
          height={16}
          className={`shrink-0 text-charcoal transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="px-5 pb-5 lg:max-h-[320px] lg:overflow-y-auto lg:[-ms-overflow-style:none] lg:[scrollbar-width:none] lg:[&::-webkit-scrollbar]:hidden">
          <div className="flex flex-col gap-1">{children}</div>
        </div>
      )}
    </div>
  );
}

export function AdBrowser({ ads }: { ads: Ad[] }) {
  const [activeCategory, setActiveCategory] = useState<AdCategory | "Semua">(
    "Semua",
  );
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("Semua Lokasi");
  const [categoryOpen, setCategoryOpen] = useState(true);
  const [locationOpen, setLocationOpen] = useState(false);
  const [page, setPage] = useState(1);

  useLayoutEffect(() => {
    // useLayoutEffect (not useEffect) so this runs before the browser paints,
    // avoiding a visible flash of the open panel on mobile before it snaps closed.
    if (window.matchMedia("(max-width: 1023px)").matches) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCategoryOpen(false);
      setLocationOpen(false);
    }
  }, []);

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

    return ads
      .filter((ad) => {
        const matchesCategory =
          activeCategory === "Semua" || ad.category === activeCategory;
        const matchesLocation = location === "Semua Lokasi" || ad.location === location;
        const matchesKeyword =
          normalizedKeyword === "" ||
          ad.title.toLowerCase().includes(normalizedKeyword) ||
          ad.description.toLowerCase().includes(normalizedKeyword);

        return matchesCategory && matchesLocation && matchesKeyword;
      })
      .sort((a, b) => {
        const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return timeB - timeA;
      });
  }, [ads, activeCategory, location, keyword]);

  const totalPages = Math.max(1, Math.ceil(filteredAds.length / PAGE_SIZE));
  const paginatedAds = filteredAds.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function changeCategory(value: AdCategory | "Semua") {
    setActiveCategory(value);
    setPage(1);
  }

  function changeLocation(value: string) {
    setLocation(value);
    setPage(1);
  }

  function changeKeyword(value: string) {
    setKeyword(value);
    setPage(1);
  }

  return (
    <main className="flex-1 px-4 py-6 sm:px-6 sm:py-8">
      <section className="relative overflow-hidden rounded-card border-[2.5px] border-ink bg-brand-dark shadow-[5px_5px_0_0_#006451]">
        <HeroBanner />

        <div className="relative -mt-5 mx-3 mb-4 flex flex-col gap-3 rounded-card border-[2.5px] border-ink bg-[#fffefa] p-4 shadow-[3px_3px_0_0_#006451] sm:mx-6 sm:mb-6 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:p-5 sm:-mt-14 lg:-mt-16">
          <div>
            <h1 className="text-xl uppercase leading-none text-charcoal sm:text-3xl">
              Temukan Semua yang Kamu Butuhkan
            </h1>
            <p className="mt-1 text-[13px] font-normal text-muted-foreground sm:text-[14px]">
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
              placeholder="Cari di Nemsy!"
              value={keyword}
              onChange={(event) => changeKeyword(event.target.value)}
              className="h-11 w-full rounded-pill border-2 border-ink bg-white pl-11 pr-4 text-[14px] font-normal text-charcoal shadow-[2px_2px_0_0_#006451] placeholder:text-charcoal/40 focus:outline-none focus:ring-3 focus:ring-cta/10"
            />
          </label>
        </div>
      </section>

      <div className="mt-8">
        <FeaturedCarousel ads={featuredAds} />
      </div>

      <Link
        href="/sayembara"
        className="mb-8 flex flex-col items-start justify-between gap-4 rounded-card border-[2.5px] border-ink bg-brand p-6 shadow-[3px_3px_0_0_#006451] transition-transform hover:-translate-y-1 sm:flex-row sm:items-center"
      >
        <div className="flex items-center gap-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-ink bg-white text-charcoal">
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
        <span className="flex h-10 shrink-0 items-center gap-1.5 rounded-pill bg-charcoal px-5 text-[14px] font-bold text-brand shadow-[2px_2px_0_0_#003f37]">
          Lihat Sayembara
          <ChevronRightIcon width={16} height={16} />
        </span>
      </Link>

      <div className="mb-6">
        <h2 className="text-3xl uppercase leading-none text-charcoal">Iklan Terbaru</h2>
        <p className="mt-1 text-[14px] font-normal text-muted-foreground">
          Produk dan jasa terbaru dari komunitas Masisir.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[240px_1fr] lg:items-start">
        <aside className="flex flex-col gap-4 lg:sticky lg:top-24">
          <FilterSection
            title="Kategori"
            open={categoryOpen}
            onToggle={() => setCategoryOpen((prev) => !prev)}
          >
            <SidebarRow
              icon={GridIcon}
              label="Semua Produk"
              count={ads.length}
              active={activeCategory === "Semua"}
              onClick={() => changeCategory("Semua")}
            />
            {categories.map((category) => (
              <SidebarRow
                key={category}
                icon={categoryIcons[category]}
                label={category}
                count={categoryCounts.get(category) ?? 0}
                active={activeCategory === category}
                onClick={() => changeCategory(category)}
              />
            ))}
          </FilterSection>

          {locations.length > 0 && (
            <FilterSection
              title="Lokasi"
              open={locationOpen}
              onToggle={() => setLocationOpen((prev) => !prev)}
            >
              <SidebarRow
                icon={MapPinIcon}
                label="Semua Lokasi"
                count={ads.length}
                active={location === "Semua Lokasi"}
                onClick={() => changeLocation("Semua Lokasi")}
              />
              {locations.map((loc) => (
                <SidebarRow
                  key={loc}
                  icon={MapPinIcon}
                  label={loc}
                  count={locationCounts.get(loc) ?? 0}
                  active={location === loc}
                  onClick={() => changeLocation(loc)}
                />
              ))}
            </FilterSection>
          )}
        </aside>

        <div>
          <div className="mb-4">
            <p className="text-[14px] font-normal text-muted-foreground">
              {filteredAds.length} iklan ditemukan.
            </p>
          </div>

          {paginatedAds.length > 0 ? (
            <>
              <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
                {paginatedAds.map((ad) => (
                  <AdCard key={ad.id} ad={ad} />
                ))}
              </div>
              <Pagination page={page} totalPages={totalPages} onChange={setPage} />
            </>
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
