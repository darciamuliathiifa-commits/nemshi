"use client";

import { SearchIcon } from "@/components/icons";

interface HeaderProps {
  title: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
}

export function Header({
  title,
  searchValue,
  onSearchChange,
  searchPlaceholder = "Cari produk atau jasa...",
}: HeaderProps) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-4 px-6 pb-2 pt-6">
      <h1 className="text-2xl leading-[30px] font-bold text-charcoal">{title}</h1>

      {onSearchChange && (
        <label className="relative w-full max-w-sm">
          <SearchIcon
            width={17}
            height={17}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-charcoal/50"
          />
          <input
            type="search"
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={(event) => onSearchChange(event.target.value)}
            className="h-11 w-full rounded-pill border-2 border-ink bg-white pl-11 pr-4 text-[14px] font-normal text-charcoal placeholder:text-charcoal/40 focus:outline-none focus:ring-3 focus:ring-cta/10"
          />
        </label>
      )}
    </header>
  );
}
