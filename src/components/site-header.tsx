import Link from "next/link";
import { AuthNav } from "@/components/auth-nav";

const NAV_LINKS = [
  { href: "/jelajahi", label: "Jelajahi Jasa" },
  { href: "/sayembara", label: "Cari Jasa" },
  { href: "/kategori", label: "Kategori" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-black/5 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center bg-primary text-sm font-bold text-white">
            N
          </span>
          <span className="text-xl font-extrabold tracking-tight text-text">Nemshi</span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium text-text-secondary md:flex">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="transition-colors hover:text-primary">
              {link.label}
            </Link>
          ))}
        </nav>

        <AuthNav />
      </div>
    </header>
  );
}
