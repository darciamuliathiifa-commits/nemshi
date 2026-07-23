"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

const NAV_LINKS = [
  { href: "/jelajahi", label: "Jelajahi Jasa" },
  { href: "/sayembara", label: "Cari Jasa" },
  { href: "/kategori", label: "Kategori" },
];

type Profile = { fullName: string | null; avatarUrl: string | null };

export function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    fetch("/api/me").then(async (response) => {
      setIsLoggedIn(response.ok);
      if (response.ok) setProfile(await response.json());
    });
  }, []);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    setIsLoggedIn(false);
    setMenuOpen(false);
    router.push("/");
    router.refresh();
  }

  function handleSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const query = new FormData(e.currentTarget).get("q");
    const q = typeof query === "string" ? query.trim() : "";
    router.push(q ? `/jelajahi?q=${encodeURIComponent(q)}` : "/jelajahi");
  }

  if (isLoggedIn) {
    return (
      <header className="sticky top-0 z-40 w-full bg-text">
        <div className="mx-auto flex max-w-6xl items-center gap-6 px-4 py-3 sm:px-6 lg:px-8">
          <Link href="/" className="flex shrink-0 items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-sm font-bold text-text">
              N
            </span>
            <span className="hidden text-lg font-semibold tracking-tight text-white sm:inline">
              Nemshi
            </span>
          </Link>

          <nav className="hidden shrink-0 items-center gap-5 text-sm md:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`transition-colors ${
                  pathname === link.href ? "font-semibold text-white" : "text-white/60 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <form onSubmit={handleSearch} className="mx-auto hidden max-w-md flex-1 sm:block">
            <div className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2">
              <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4 shrink-0 text-white/50">
                <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.6" />
                <path d="M17 17L13.5 13.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
              <input
                name="q"
                type="search"
                placeholder="Cari jasa..."
                className="w-full bg-transparent text-sm text-white placeholder:text-white/40 outline-none"
              />
            </div>
          </form>

          <div className="ml-auto flex shrink-0 items-center gap-3">
            <Link
              href="/tersimpan"
              aria-label="Tersimpan"
              className="flex h-9 w-9 items-center justify-center rounded-full text-white/70 transition-colors hover:bg-white/10 hover:text-white"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 4a1 1 0 0 0-1 1v15l7-4.2 7 4.2V5a1 1 0 0 0-1-1H6Z"
                />
              </svg>
            </Link>

            <Link
              href="/pasang-iklan"
              className="hidden rounded-full bg-white px-4 py-1.5 text-sm font-semibold text-text transition-colors hover:bg-white/90 sm:inline-block"
            >
              Pasang Iklan
            </Link>

            <div className="relative">
              <button
                onClick={() => setMenuOpen((open) => !open)}
                aria-label="Menu akun"
                className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-white/10 text-sm font-semibold text-white"
              >
                {profile?.avatarUrl ? (
                  <Image
                    src={profile.avatarUrl}
                    alt=""
                    width={36}
                    height={36}
                    className="h-9 w-9 object-cover"
                    unoptimized
                  />
                ) : (
                  (profile?.fullName?.[0] ?? "N").toUpperCase()
                )}
              </button>

              {menuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
                  <div className="absolute right-0 top-11 z-50 w-52 rounded-2xl border border-black/5 bg-white p-1.5 text-sm text-text shadow-lg">
                    <div className="mb-1.5 flex flex-col gap-0.5 border-b border-black/5 pb-1.5 md:hidden">
                      {NAV_LINKS.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          onClick={() => setMenuOpen(false)}
                          className="block rounded-xl px-3 py-2 hover:bg-surface"
                        >
                          {link.label}
                        </Link>
                      ))}
                      <Link
                        href="/pasang-iklan"
                        onClick={() => setMenuOpen(false)}
                        className="block rounded-xl px-3 py-2 font-semibold text-accent hover:bg-surface"
                      >
                        Pasang Iklan
                      </Link>
                    </div>
                    <Link
                      href="/iklan-saya"
                      onClick={() => setMenuOpen(false)}
                      className="block rounded-xl px-3 py-2 hover:bg-surface"
                    >
                      Iklan Saya
                    </Link>
                    <Link
                      href="/akun"
                      onClick={() => setMenuOpen(false)}
                      className="block rounded-xl px-3 py-2 hover:bg-surface"
                    >
                      Akun Saya
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full rounded-xl px-3 py-2 text-left hover:bg-surface"
                    >
                      Keluar
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </header>
    );
  }

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

        <div className="flex shrink-0 items-center gap-4 text-sm text-text">
          <Link href="/masuk" className="transition-colors hover:text-accent">
            Masuk
          </Link>
          <Link
            href="/daftar"
            className="rounded-full bg-primary px-4 py-1.5 font-medium text-white transition-colors hover:bg-primary-dark"
          >
            Daftar
          </Link>
        </div>
      </div>
    </header>
  );
}
