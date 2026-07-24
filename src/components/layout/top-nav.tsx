"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  BookmarkIcon,
  CloseIcon,
  ListIcon,
  MegaphoneIcon,
  MenuIcon,
  PlusCircleIcon,
  SearchIcon,
  UserIcon,
} from "@/components/icons";
import { TickerBar } from "@/components/layout/ticker-bar";

const navItems = [
  { href: "/jelajahi", label: "Eksplor" },
  { href: "/sayembara", label: "Sayembara", icon: MegaphoneIcon },
  { href: "/iklan-saya", label: "Iklan Saya", icon: ListIcon },
  { href: "/tersimpan", label: "Tersimpan", icon: BookmarkIcon },
];

export function TopNav() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="sticky top-0 z-40 bg-brand">
      <TickerBar />

      <div className="px-6 py-3">
        <div className="mx-auto flex w-full max-w-[1800px] items-center justify-between gap-3 rounded-pill bg-white/95 px-4 py-2.5 shadow-sm backdrop-blur">
          <Link href="/jelajahi" className="shrink-0 text-lg font-bold tracking-tight text-charcoal">
            Nemshi
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {navItems.map((item) => {
              const isActive = pathname?.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-pill px-4 py-2 text-[14px] font-bold transition-colors ${
                    isActive
                      ? "bg-charcoal text-white"
                      : "text-charcoal hover:bg-surface"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/jelajahi"
              className="hidden h-10 w-10 items-center justify-center rounded-full text-charcoal transition-colors hover:bg-surface sm:flex"
              aria-label="Cari iklan"
            >
              <SearchIcon width={18} height={18} />
            </Link>
            <Link
              href="/profil"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-surface text-charcoal transition-colors hover:bg-brand"
              aria-label="Profil saya"
            >
              <UserIcon width={18} height={18} />
            </Link>
            <Link
              href="/pasang-iklan"
              className="hidden h-10 shrink-0 items-center gap-1.5 rounded-pill bg-charcoal px-5 text-[14px] font-bold text-white transition-colors hover:bg-black sm:flex"
            >
              <PlusCircleIcon width={16} height={16} />
              Pasang Iklan
            </Link>
            <button
              type="button"
              aria-label="Buka menu"
              onClick={() => setMobileOpen(true)}
              className="flex h-10 w-10 items-center justify-center rounded-full text-charcoal hover:bg-surface lg:hidden"
            >
              <MenuIcon width={20} height={20} />
            </button>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Tutup menu"
            onClick={() => setMobileOpen(false)}
            className="absolute inset-0 bg-ink/40"
          />
          <div className="absolute right-0 top-0 flex h-full w-72 max-w-[80vw] flex-col bg-white px-4 py-6 shadow-xl">
            <div className="flex items-center justify-between px-2">
              <span className="text-lg font-bold tracking-tight text-charcoal">
                Nemshi
              </span>
              <button
                type="button"
                aria-label="Tutup menu"
                onClick={() => setMobileOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-surface"
              >
                <CloseIcon width={20} height={20} />
              </button>
            </div>

            <nav className="mt-6 flex flex-col gap-1">
              {[...navItems, { href: "/pasang-iklan", label: "Pasang Iklan", icon: PlusCircleIcon }, { href: "/profil", label: "Profil", icon: UserIcon }].map(
                (item) => {
                  const isActive = pathname?.startsWith(item.href);
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-3 rounded-input px-3 py-2.5 text-base font-normal transition-colors ${
                        isActive ? "bg-brand/40 text-charcoal" : "text-charcoal hover:bg-surface"
                      }`}
                    >
                      {Icon && <Icon width={20} height={20} />}
                      {item.label}
                    </Link>
                  );
                },
              )}
            </nav>
          </div>
        </div>
      )}
    </div>
  );
}
