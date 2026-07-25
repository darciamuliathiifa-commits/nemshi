"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  BookmarkIcon,
  ChevronDownIcon,
  CloseIcon,
  CompassIcon,
  ListIcon,
  MegaphoneIcon,
  MenuIcon,
  PlusCircleIcon,
  SearchIcon,
  UserIcon,
  ZapIcon,
} from "@/components/icons";
import { TickerBar } from "@/components/layout/ticker-bar";
import { NotificationBell } from "@/components/layout/notification-bell";
import type { UserQuota } from "@/lib/server/quota-store";

const navItems = [
  { href: "/jelajahi", label: "Eksplor" },
  { href: "/sayembara", label: "Sayembara", icon: MegaphoneIcon },
  { href: "/iklan-saya", label: "Iklan Saya", icon: ListIcon },
  { href: "/tersimpan", label: "Tersimpan", icon: BookmarkIcon },
  { href: "/tentang-kami", label: "Tentang Kami" },
];

const drawerNavItems = [
  { href: "/jelajahi", label: "Eksplor", icon: CompassIcon },
  { href: "/sayembara", label: "Sayembara", icon: MegaphoneIcon },
  { href: "/iklan-saya", label: "Iklan Saya", icon: ListIcon },
  { href: "/tersimpan", label: "Tersimpan", icon: BookmarkIcon },
  { href: "/profil", label: "Profil", icon: UserIcon },
];

function slotsLeft(quota: UserQuota | null) {
  if (!quota) return null;
  return {
    ads: (quota.freeAdSlotUsed ? 0 : 1) + quota.extraAdSlots,
    sayembara: (quota.freeSayembaraSlotUsed ? 0 : 1) + quota.extraSayembaraSlots,
  };
}

export function TopNav() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [postMenuOpen, setPostMenuOpen] = useState(false);
  const [quota, setQuota] = useState<UserQuota | null>(null);

  useEffect(() => {
    fetch("/api/mayar/quota")
      .then((res) => (res.ok ? res.json() : null))
      .then(setQuota)
      .catch(() => setQuota(null));
  }, []);

  const slots = slotsLeft(quota);

  return (
    <div className="sticky top-0 z-40 bg-brand">
      <TickerBar />

      <div className="px-6 py-3">
        <div className="mx-auto flex w-full max-w-[1400px] items-center justify-between gap-3 rounded-pill bg-white/95 px-4 py-2.5 shadow-sm backdrop-blur">
          <Link href="/jelajahi" className="shrink-0 text-lg font-bold tracking-tight text-charcoal">
            Nemsy!
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
            {slots && (
              <Link
                href="/profil"
                className="hidden shrink-0 items-center gap-1.5 whitespace-nowrap rounded-pill border-2 border-ink bg-brand px-3 py-1.5 text-[12px] font-bold text-charcoal transition-colors hover:bg-brand/70 xl:flex"
                title="Jatah posting kamu"
              >
                <ZapIcon width={13} height={13} />
                Jatah: {slots.ads} Iklan · {slots.sayembara} Sayembara
              </Link>
            )}
            <Link
              href="/jelajahi"
              className="hidden h-10 w-10 items-center justify-center rounded-full text-charcoal transition-colors hover:bg-surface sm:flex"
              aria-label="Cari iklan"
            >
              <SearchIcon width={18} height={18} />
            </Link>
            <NotificationBell />
            <Link
              href="/profil"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-surface text-charcoal transition-colors hover:bg-brand"
              aria-label="Profil saya"
            >
              <UserIcon width={18} height={18} />
            </Link>

            <div className="relative hidden sm:block">
              <button
                type="button"
                onClick={() => setPostMenuOpen((prev) => !prev)}
                aria-expanded={postMenuOpen}
                className="flex h-10 shrink-0 items-center gap-1.5 rounded-pill bg-charcoal px-5 text-[14px] font-bold text-white transition-colors hover:bg-black"
              >
                <PlusCircleIcon width={16} height={16} />
                Pasang Iklan/Sayembara
                <ChevronDownIcon width={14} height={14} />
              </button>

              {postMenuOpen && (
                <>
                  <button
                    type="button"
                    aria-label="Tutup menu"
                    onClick={() => setPostMenuOpen(false)}
                    className="fixed inset-0 z-40 cursor-default"
                  />
                  <div className="absolute right-0 z-50 mt-2 w-56 overflow-hidden rounded-card border-2 border-ink bg-white shadow-[3px_3px_0_0_rgba(20,20,20,1)]">
                    <Link
                      href="/pasang-iklan"
                      onClick={() => setPostMenuOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-3 text-[14px] font-bold text-charcoal transition-colors hover:bg-surface"
                    >
                      <ListIcon width={16} height={16} />
                      Pasang Iklan
                    </Link>
                    <Link
                      href="/sayembara/baru"
                      onClick={() => setPostMenuOpen(false)}
                      className="flex items-center gap-2.5 border-t border-border-subtle px-4 py-3 text-[14px] font-bold text-charcoal transition-colors hover:bg-surface"
                    >
                      <MegaphoneIcon width={16} height={16} />
                      Pasang Sayembara
                    </Link>
                  </div>
                </>
              )}
            </div>

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
          <div className="absolute right-0 top-0 flex h-full w-80 max-w-[85vw] flex-col overflow-y-auto border-l-2 border-ink bg-white shadow-[-4px_0_0_0_rgba(20,20,20,1)]">
            <div className="relative overflow-hidden bg-gradient-to-br from-brand-dark to-brand bg-dot-pattern px-5 py-6">
              <div className="flex items-center justify-between">
                <span className="text-xl font-bold tracking-tight text-charcoal">
                  Nemsy!
                </span>
                <button
                  type="button"
                  aria-label="Tutup menu"
                  onClick={() => setMobileOpen(false)}
                  className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-ink bg-white text-charcoal transition-colors hover:bg-surface"
                >
                  <CloseIcon width={18} height={18} />
                </button>
              </div>

              {slots && (
                <div className="mt-4 flex items-center gap-2 rounded-pill border-2 border-ink bg-white px-3.5 py-2 text-[13px] font-bold text-charcoal shadow-[2px_2px_0_0_rgba(20,20,20,1)]">
                  <ZapIcon width={14} height={14} className="shrink-0 text-cta" />
                  Jatah: {slots.ads} Iklan · {slots.sayembara} Sayembara
                </div>
              )}
            </div>

            <nav className="flex flex-col gap-1.5 px-4 py-5">
              {drawerNavItems.map((item) => {
                const isActive = pathname?.startsWith(item.href);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 rounded-pill px-3 py-2.5 text-[15px] font-bold transition-colors ${
                      isActive ? "bg-charcoal text-white" : "text-charcoal hover:bg-surface"
                    }`}
                  >
                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                        isActive ? "bg-white/20" : "bg-surface"
                      }`}
                    >
                      <Icon width={16} height={16} />
                    </span>
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="mt-auto flex flex-col gap-2 border-t-2 border-border-subtle px-4 py-5">
              <Link
                href="/pasang-iklan"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center gap-2 rounded-pill border-2 border-ink bg-white px-4 py-3 text-[14px] font-bold text-charcoal shadow-[2px_2px_0_0_rgba(20,20,20,1)] transition-transform hover:-translate-y-0.5"
              >
                <ListIcon width={18} height={18} />
                Pasang Iklan
              </Link>
              <Link
                href="/sayembara/baru"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center gap-2 rounded-pill bg-charcoal px-4 py-3 text-[14px] font-bold text-white shadow-[2px_2px_0_0_rgba(20,20,20,1)] transition-transform hover:-translate-y-0.5"
              >
                <MegaphoneIcon width={18} height={18} />
                Pasang Sayembara
              </Link>
              <Link
                href="/tentang-kami"
                onClick={() => setMobileOpen(false)}
                className="mt-1 text-center text-[12px] font-bold text-charcoal/40 transition-colors hover:text-charcoal/70"
              >
                Tentang Kami
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
