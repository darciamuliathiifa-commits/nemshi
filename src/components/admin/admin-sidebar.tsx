"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CheckCircleIcon,
  CreditCardIcon,
  FlagIcon,
  GridIcon,
} from "@/components/icons";

const navItems = [
  { href: "/admin", label: "Dasbor", icon: GridIcon },
  { href: "/admin/moderasi", label: "Moderasi Iklan", icon: CheckCircleIcon },
  { href: "/admin/laporan", label: "Laporan", icon: FlagIcon },
  { href: "/admin/paket-plus", label: "Paket Plus", icon: CreditCardIcon },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 flex h-screen w-60 shrink-0 flex-col bg-charcoal px-4 py-6">
      <Link href="/admin" className="flex items-center gap-2 px-2 text-lg font-bold tracking-tight text-white">
        <span className="h-2.5 w-2.5 rounded-full bg-brand" />
        Nemsy! Admin
      </Link>

      <nav className="mt-8 flex flex-col gap-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-input px-3 py-2.5 text-base font-normal transition-colors ${
                isActive
                  ? "bg-brand text-charcoal"
                  : "text-white/60 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon width={20} height={20} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <Link
        href="/jelajahi"
        className="mt-auto px-3 py-2.5 text-[14px] font-bold text-white/50 hover:text-white"
      >
        ← Kembali ke Nemsy!
      </Link>
    </aside>
  );
}
