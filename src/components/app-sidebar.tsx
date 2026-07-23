"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="11" cy="11" r="6.5" />
      <path strokeLinecap="round" d="M20 20l-4.3-4.3" />
    </svg>
  );
}

function ClipboardIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="5" y="4.5" width="14" height="16" rx="2" />
      <path strokeLinecap="round" d="M9 4.5V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v.5" />
      <path strokeLinecap="round" d="M8.5 11h7M8.5 15h5" />
    </svg>
  );
}

function GridIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="4" y="4" width="7" height="7" rx="1.5" />
      <rect x="13" y="4" width="7" height="7" rx="1.5" />
      <rect x="4" y="13" width="7" height="7" rx="1.5" />
      <rect x="13" y="13" width="7" height="7" rx="1.5" />
    </svg>
  );
}

function BookmarkIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 4a1 1 0 0 0-1 1v15l7-4.2 7 4.2V5a1 1 0 0 0-1-1H6Z"
      />
    </svg>
  );
}

function PlusIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2.2">
      <path strokeLinecap="round" d="M12 5v14M5 12h14" />
    </svg>
  );
}

const NAV_ITEMS = [
  { href: "/jelajahi", label: "Jelajahi Jasa", icon: SearchIcon },
  { href: "/sayembara", label: "Cari Jasa", icon: ClipboardIcon },
  { href: "/kategori", label: "Kategori", icon: GridIcon },
  { href: "/tersimpan", label: "Tersimpan", icon: BookmarkIcon },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-40 flex w-16 flex-col items-center border-r border-black/5 bg-white py-5 sm:w-20">
      <Link
        href="/"
        aria-label="Beranda Nemshi"
        className="mb-6 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-primary text-base font-bold text-white"
      >
        N
      </Link>

      <nav className="flex flex-col items-center gap-1.5">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-label={item.label}
              title={item.label}
              className={`flex h-11 w-11 items-center justify-center rounded-2xl transition-colors ${
                active ? "bg-accent/10 text-accent" : "text-text-secondary hover:bg-surface hover:text-text"
              }`}
            >
              <Icon className="h-5 w-5" />
            </Link>
          );
        })}
      </nav>

      <div className="flex-1" />

      <Link
        href="/pasang-iklan"
        aria-label="Pasang Iklan"
        title="Pasang Iklan"
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary text-white transition-transform hover:scale-105"
      >
        <PlusIcon className="h-5 w-5" />
      </Link>
    </aside>
  );
}
