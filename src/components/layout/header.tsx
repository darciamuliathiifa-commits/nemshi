"use client";

import { SearchIcon } from "@/components/icons";

interface HeaderProps {
  title: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  containerClassName?: string;
}

export function Header({
  title,
  searchValue,
  onSearchChange,
  searchPlaceholder = "Cari produk atau jasa...",
  containerClassName,
}: HeaderProps) {
  return (
    <header className="w-full px-4 pb-2 pt-6 sm:px-6">
      <div
        className={`mx-auto flex flex-wrap items-center justify-between gap-4 ${
          containerClassName ?? "w-full"
        }`}
      >
        <h1 className="text-3xl uppercase leading-none text-charcoal">{title}</h1>

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
              className="h-11 w-full rounded-pill border-2 border-ink bg-white pl-11 pr-4 text-[14px] font-normal text-charcoal shadow-[2px_2px_0_0_#006451] placeholder:text-charcoal/40 focus:outline-none focus:ring-3 focus:ring-cta/10"
            />
          </label>
        )}
      </div>
    </header>
  );
}
