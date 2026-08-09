"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CheckCircleIcon,
  CreditCardIcon,
  FlagIcon,
  GridIcon,
  UserIcon,
} from "@/components/icons";

const navItems = [
  { href: "/admin", label: "Dasbor", icon: GridIcon },
  { href: "/admin/moderasi", label: "Moderasi Iklan", icon: CheckCircleIcon },
  { href: "/admin/laporan", label: "Laporan", icon: FlagIcon },
  { href: "/admin/pengguna", label: "Pengguna & Kuota", icon: UserIcon },
  { href: "/admin/paket-plus", label: "Transaksi", icon: CreditCardIcon },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 flex h-screen w-64 shrink-0 flex-col border-r-[2.5px] border-ink bg-charcoal p-5 text-white shadow-[4px_0_0_0_rgba(20,20,20,0.1)]">
      <Link href="/admin" className="flex items-center gap-2.5 px-2 py-1">
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
      </Link>

      <nav className="mt-8 flex flex-col gap-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
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

      <Link
        href="/jelajahi"
        className="mt-auto flex items-center justify-center gap-2 rounded-pill border-2 border-white/20 bg-white/5 py-2.5 text-[13px] font-bold text-white/80 transition-colors hover:bg-white/15 hover:text-white"
      >
        ← Kembali ke Website
      </Link>
    </aside>
  );
}
