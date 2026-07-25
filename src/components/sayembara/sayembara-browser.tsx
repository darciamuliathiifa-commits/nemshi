"use client";

import { memo, useMemo, useState } from "react";
import Link from "next/link";
import { PlusCircleIcon, SearchIcon } from "@/components/icons";
import { formatRelativeTime } from "@/lib/format-relative-time";
import { Pagination } from "@/components/shared/pagination";

const PAGE_SIZE = 20;

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
      className="flex flex-col gap-1.5 rounded-card border-2 border-ink bg-white p-3 shadow-[2px_2px_0_0_rgba(20,20,20,1)] transition-transform hover:-translate-y-0.5 sm:gap-3 sm:border-[2.5px] sm:p-6 sm:shadow-[3px_3px_0_0_rgba(20,20,20,1)]"
    >
      <div className="flex items-center justify-between gap-2">
        <span className="rounded-badge bg-highlight px-2 py-0.5 text-[10px] leading-3 font-bold text-white sm:px-3 sm:py-1 sm:text-[12px] sm:leading-4">
          {item.category}
        </span>
        <span
          className={`rounded-badge px-2 py-0.5 text-[10px] leading-3 font-bold sm:px-3 sm:py-1 sm:text-[12px] sm:leading-4 ${statusAccent[item.status] ?? statusAccent.Aktif}`}
        >
          {item.status}
        </span>
      </div>

      <h3 className="line-clamp-2 text-[13px] font-normal leading-4 text-charcoal sm:text-xl sm:leading-[26px]">
        {item.title}
      </h3>

      <p className="line-clamp-2 text-[11px] leading-4 font-normal text-muted-foreground sm:line-clamp-none sm:text-[14px] sm:leading-5">
        {item.description}
      </p>

      {(item.price_label || item.wa_nego) && (
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          {item.price_label && (
            <span className="text-[12px] font-bold text-cta sm:text-[14px]">
              {item.price_label}
            </span>
          )}
          {item.wa_nego && (
            <span className="rounded-badge bg-success/10 px-2 py-0.5 text-[10px] font-bold text-success sm:px-2.5 sm:py-1 sm:text-[11px]">
              Nego via WA
            </span>
          )}
        </div>
      )}

      <div className="mt-auto flex items-center justify-between gap-2 border-t border-border-subtle pt-2 sm:pt-3">
        <span className="truncate text-[10px] font-bold text-muted-foreground sm:text-[12px]">
          {item.location}
        </span>
        <span className="shrink-0 rounded-badge bg-surface px-2 py-0.5 text-[10px] font-bold text-charcoal sm:px-2.5 sm:py-1 sm:text-[12px]">
          {item.applicantCount} pendaftar
        </span>
      </div>

      <div className="flex items-center justify-between gap-2 text-[10px] text-muted-foreground sm:text-[12px]">
        <span className="truncate">{item.ownerName ?? "Pengguna Nemshi"}</span>
        <span className="shrink-0">{formatRelativeTime(item.created_at)}</span>
      </div>
    </Link>
  );
});

export function SayembaraBrowser({ items }: { items: SayembaraListItem[] }) {
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(1);

  const filteredItems = useMemo(() => {
    const normalized = keyword.trim().toLowerCase();
    if (!normalized) return items;

    return items.filter(
      (item) =>
        item.title.toLowerCase().includes(normalized) ||
        item.description.toLowerCase().includes(normalized),
    );
  }, [items, keyword]);

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / PAGE_SIZE));
  const paginatedItems = filteredItems.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function changeKeyword(value: string) {
    setKeyword(value);
    setPage(1);
  }

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
                onChange={(event) => changeKeyword(event.target.value)}
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

      {paginatedItems.length > 0 ? (
        <>
          <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4">
            {paginatedItems.map((item) => (
              <SayembaraCard key={item.id} item={item} />
            ))}
          </div>
          <Pagination page={page} totalPages={totalPages} onChange={setPage} />
        </>
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
