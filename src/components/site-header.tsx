import Link from "next/link";
import { AuthNav } from "@/components/auth-nav";

const NAV_LINKS = [
  { href: "/jelajahi", label: "Jelajahi Jasa" },
  { href: "/sayembara", label: "Cari Jasa" },
  { href: "/kategori", label: "Kategori" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-4 z-40 flex justify-center px-4">
      <div className="flex w-full max-w-5xl items-center justify-between gap-6 rounded-full border border-black/5 bg-[rgba(237,237,237,0.72)] px-5 py-2.5 backdrop-blur-md">
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
            N
          </span>
          <span className="text-lg font-semibold tracking-tight text-text">Nemshi</span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm text-text md:flex">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="transition-colors hover:text-accent">
              {link.label}
            </Link>
          ))}
        </nav>

        <AuthNav />
      </div>
    </header>
  );
}
