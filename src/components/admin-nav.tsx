"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: "📊" },
  { href: "/admin/moderasi", label: "Antrean Moderasi", icon: "🛡️" },
  { href: "/admin/laporan", label: "Laporan Komunitas", icon: "🚩" },
  { href: "/admin/jasa", label: "Kelola Jasa", icon: "📦" },
  { href: "/admin/pengguna", label: "Kelola Pengguna", icon: "👤" },
  { href: "/admin/testimoni", label: "Testimoni", icon: "⭐" },
  { href: "/admin/kategori", label: "Kategori & Refund", icon: "🏷️" },
  { href: "/admin/transaksi", label: "Pantau Transaksi", icon: "💳" },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1">
      {NAV_ITEMS.map((item) => {
        const isActive = item.href === "/admin" ? pathname === "/admin" : pathname?.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-2.5 px-3 py-2 text-sm font-medium transition-colors ${
              isActive ? "bg-primary text-white" : "text-text-secondary hover:bg-surface"
            }`}
          >
            <span className="text-base">{item.icon}</span>
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
