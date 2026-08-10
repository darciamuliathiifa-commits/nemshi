"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  CheckCircleIcon,
  CloseIcon,
  CreditCardIcon,
  FlagIcon,
  GridIcon,
  MegaphoneIcon,
  MenuIcon,
  StoreIcon,
  UserIcon,
} from "@/components/icons";

const navItems = [
  { href: "/admin", label: "Dasbor", icon: GridIcon },
  { href: "/admin/iklan", label: "Semua Iklan", icon: StoreIcon },
  { href: "/admin/moderasi", label: "Moderasi Iklan", icon: CheckCircleIcon },
  { href: "/admin/laporan", label: "Laporan", icon: FlagIcon },
  { href: "/admin/pengguna", label: "Pengguna & Kuota", icon: UserIcon },
  { href: "/admin/paket-plus", label: "Transaksi", icon: CreditCardIcon },
  { href: "/admin/promosi", label: "Script Promosi", icon: MegaphoneIcon },
];

function Brand() {
  return (
    <div className="flex items-center gap-2.5 px-2 py-1">
      <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-ink bg-brand text-sm font-bold text-charcoal shadow-[2px_2px_0_0_rgba(20,20,20,1)]">
        N!
      </span>
      <div>
        <span className="block text-base font-bold leading-none tracking-tight text-white">
          Nemsy!
        </span>
        <span className="block text-[10px] font-bold text-brand tracking-widest uppercase">
          Admin Panel
        </span>
      </div>
    </div>
  );
}

function NavList({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  return (
    <nav className="mt-8 flex flex-col gap-2">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={`flex items-center gap-3 rounded-pill px-4 py-2.5 text-[14px] font-bold transition-all ${
              isActive
                ? "border-2 border-ink bg-brand text-charcoal shadow-[3px_3px_0_0_rgba(20,20,20,1)]"
                : "text-white/70 hover:bg-white/10 hover:text-white"
            }`}
          >
            <Icon width={18} height={18} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function AdminSidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close the drawer whenever the route changes (e.g. after tapping a link).
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <>
      {/* Mobile top bar — replaces the desktop sidebar below sm */}
      <header className="sticky top-0 z-40 flex items-center justify-between border-b-[2.5px] border-ink bg-charcoal px-4 py-3 sm:hidden">
        <Link href="/admin" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-ink bg-brand text-sm font-bold text-charcoal">
            N!
          </span>
          <span className="text-[12px] font-bold uppercase tracking-widest text-brand">
            Admin Panel
          </span>
        </Link>
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          aria-label="Buka menu admin"
          className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white/30 text-white"
        >
          <MenuIcon width={20} height={20} />
        </button>
      </header>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 sm:hidden">
          <button
            type="button"
            aria-label="Tutup menu admin"
            onClick={() => setMobileOpen(false)}
            className="absolute inset-0 bg-ink/60"
          />
          <aside className="absolute left-0 top-0 flex h-full w-72 max-w-[82vw] flex-col overflow-y-auto border-r-[2.5px] border-ink bg-charcoal p-5 text-white">
            <div className="flex items-center justify-between">
              <Brand />
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                aria-label="Tutup menu"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-white/30 text-white"
              >
                <CloseIcon width={16} height={16} />
              </button>
            </div>

            <NavList pathname={pathname} onNavigate={() => setMobileOpen(false)} />

            <Link
              href="/jelajahi"
              className="mt-auto flex items-center justify-center gap-2 rounded-pill border-2 border-white/20 bg-white/5 py-2.5 text-[13px] font-bold text-white/80 transition-colors hover:bg-white/15 hover:text-white"
            >
              ← Kembali ke Website
            </Link>
          </aside>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r-[2.5px] border-ink bg-charcoal p-5 text-white shadow-[4px_0_0_0_rgba(20,20,20,0.1)] sm:flex">
        <Brand />
        <NavList pathname={pathname} />
        <Link
          href="/jelajahi"
          className="mt-auto flex items-center justify-center gap-2 rounded-pill border-2 border-white/20 bg-white/5 py-2.5 text-[13px] font-bold text-white/80 transition-colors hover:bg-white/15 hover:text-white"
        >
          ← Kembali ke Website
        </Link>
      </aside>
    </>
  );
}
