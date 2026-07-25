"use client";

import { memo, useMemo, useState } from "react";
import Link from "next/link";
import { PlusCircleIcon, SearchIcon } from "@/components/icons";
import { formatRelativeTime } from "@/lib/format-relative-time";

const statusAccent: Record<string, string> = {
  Aktif: "bg-success text-white",
  Terjual: "bg-charcoal text-white",
  Selesai: "bg-charcoal text-white",
  Kedaluwarsa: "bg-muted text-white",
  Ditutup: "bg-error text-white",
};

export interface SayembaraListItem {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string | null;
  price_label: string | null;
  wa_nego: boolean;
  status: string;
  created_at: string;
  ownerName: string | null;
  applicantCount: number;
}

const SayembaraCard = memo(function SayembaraCard({ item }: { item: SayembaraListItem }) {
  return (
    <Link
      href={`/sayembara/${item.id}`}
      className="flex flex-col gap-3 rounded-card border-[2.5px] border-ink bg-white p-6 shadow-[3px_3px_0_0_rgba(20,20,20,1)] transition-transform hover:-translate-y-0.5"
    >
      <div className="flex items-center justify-between gap-2">
        <span className="rounded-badge bg-highlight px-3 py-1 text-[12px] leading-4 font-bold text-white">
          {item.category}
        </span>
        <span
          className={`rounded-badge px-3 py-1 text-[12px] leading-4 font-bold ${statusAccent[item.status] ?? statusAccent.Aktif}`}
        >
          {item.status}
        </span>
      </div>

      <h3 className="text-xl font-normal leading-[26px] text-charcoal">{item.title}</h3>

      <p className="text-[14px] leading-5 font-normal text-muted-foreground">
        {item.description}
      </p>

      {(item.price_label || item.wa_nego) && (
        <div className="flex flex-wrap items-center gap-2">
          {item.price_label && (
            <span className="text-[14px] font-bold text-cta">{item.price_label}</span>
          )}
          {item.wa_nego && (
            <span className="rounded-badge bg-success/10 px-2.5 py-1 text-[11px] font-bold text-success">
              Nego via WA
            </span>
          )}
        </div>
      )}

      <div className="mt-auto flex items-center justify-between border-t border-border-subtle pt-3">
        <span className="text-[12px] font-bold text-muted-foreground">{item.location}</span>
        <span className="rounded-badge bg-surface px-2.5 py-1 text-[12px] font-bold text-charcoal">
          {item.applicantCount} pendaftar
        </span>
      </div>

      <div className="flex items-center justify-between text-[12px] text-muted-foreground">
        <span>{item.ownerName ?? "Pengguna Nemshi"}</span>
        <span>{formatRelativeTime(item.created_at)}</span>
      </div>
    </Link>
  );
});

export function SayembaraBrowser({ items }: { items: SayembaraListItem[] }) {
  const [keyword, setKeyword] = useState("");

  const filteredItems = useMemo(() => {
    const normalized = keyword.trim().toLowerCase();
    if (!normalized) return items;

    return items.filter(
      (item) =>
        item.title.toLowerCase().includes(normalized) ||
        item.description.toLowerCase().includes(normalized),
    );
  }, [items, keyword]);

  return (
    <main className="flex-1 px-6 py-8">
      <section className="relative overflow-hidden rounded-card border-[2.5px] border-ink bg-gradient-to-br from-brand-dark to-brand bg-dot-pattern shadow-[5px_5px_0_0_rgba(20,20,20,1)]">
        <div className="relative flex h-[180px] items-center justify-center overflow-hidden sm:h-[220px]">
          <span
            aria-hidden
            className="select-none whitespace-nowrap text-[90px] font-black leading-none tracking-tight text-white/15 sm:text-[150px]"
          >
            Sayembara
          </span>
        </div>

        <div className="relative -mt-8 mx-4 mb-4 flex flex-col gap-4 rounded-card border-[2.5px] border-ink bg-white p-5 shadow-[3px_3px_0_0_rgba(20,20,20,1)] sm:mx-6 sm:mb-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-bold text-charcoal sm:text-2xl">
              Butuh Bantuan? Pasang Sayembara
            </h1>
            <p className="mt-1 text-[14px] font-normal text-muted-foreground">
              Beritahu komunitas Masisir kebutuhanmu, biarkan mereka yang
              menawarkan bantuan.
            </p>
          </div>

          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:shrink-0">
            <label className="relative w-full sm:w-56">
              <SearchIcon
                width={16}
                height={16}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-charcoal/50"
              />
              <input
                type="search"
                placeholder="Cari sayembara..."
                value={keyword}
                onChange={(event) => setKeyword(event.target.value)}
                className="h-11 w-full rounded-pill border-2 border-ink bg-white pl-11 pr-4 text-[14px] font-normal text-charcoal placeholder:text-charcoal/40 focus:outline-none focus:ring-3 focus:ring-cta/10"
              />
            </label>
            <Link
              href="/sayembara/baru"
              className="flex h-11 shrink-0 items-center justify-center gap-1.5 rounded-pill bg-charcoal px-5 text-[14px] font-bold text-white transition-colors hover:bg-black"
            >
              <PlusCircleIcon width={16} height={16} />
              Pasang Sayembara
            </Link>
          </div>
        </div>
      </section>

      <div className="mb-4 mt-8">
        <p className="text-[14px] font-normal text-muted-foreground">
          {filteredItems.length} sayembara ditemukan.
        </p>
      </div>

      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredItems.map((item) => (
            <SayembaraCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-card border border-dashed border-border-strong py-16 text-center">
          <p className="text-base font-normal text-charcoal">
            {items.length === 0 ? "Belum ada sayembara." : "Sayembara tidak ditemukan."}
          </p>
          <p className="mt-1 text-[14px] font-normal text-muted-foreground">
            {items.length === 0
              ? "Jadilah yang pertama memasang sayembara untuk komunitas Masisir."
              : "Coba ubah kata kunci pencarian."}
          </p>
        </div>
      )}
    </main>
  );
}
