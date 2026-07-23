"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Category = { id: string; name: string; slug: string; icon: string };
type Profile = { fullName: string | null; avatarUrl: string | null };

function SearchGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className}>
      <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.6" />
      <path d="M17 17L13.5 13.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export function AppTopbar() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    fetch("/api/categories")
      .then((response) => response.json())
      .then((data: Category[]) => setCategories(data.slice(0, 4)));

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

  return (
    <header className="sticky top-0 z-30 flex flex-wrap items-center gap-3 border-b border-black/5 bg-white/85 px-4 py-3 backdrop-blur-md sm:px-6">
      <div className="order-1 flex w-full items-center gap-1 overflow-x-auto rounded-full bg-surface p-1 sm:order-none sm:w-auto">
        <Link
          href="/jelajahi"
          className="shrink-0 rounded-full px-3.5 py-1.5 text-sm font-medium text-text transition-colors hover:bg-white"
        >
          Semua
        </Link>
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/jelajahi?category=${category.slug}`}
            className="shrink-0 whitespace-nowrap rounded-full px-3.5 py-1.5 text-sm font-medium text-text-secondary transition-colors hover:bg-white hover:text-text"
          >
            {category.icon} {category.name}
          </Link>
        ))}
      </div>

      <form onSubmit={handleSearch} className="order-2 flex-1 sm:order-none sm:ml-2 sm:max-w-xs">
        <div className="flex items-center gap-2 rounded-full border border-black/10 bg-surface px-3.5 py-2">
          <SearchGlyph className="h-4 w-4 shrink-0 text-text-secondary" />
          <input
            name="q"
            type="search"
            placeholder="Cari jasa..."
            className="w-full bg-transparent text-sm text-text placeholder:text-text-secondary outline-none"
          />
        </div>
      </form>

      <div className="order-2 ml-auto flex shrink-0 items-center gap-3 sm:order-none">
        {isLoggedIn === false && (
          <>
            <Link href="/masuk" className="text-sm font-medium text-text transition-colors hover:text-accent">
              Masuk
            </Link>
            <Link
              href="/daftar"
              className="rounded-full bg-primary px-4 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
            >
              Daftar
            </Link>
          </>
        )}

        {isLoggedIn && (
          <div className="relative">
            <button
              onClick={() => setMenuOpen((open) => !open)}
              aria-label="Menu akun"
              className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-surface text-sm font-semibold text-text"
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
                <div className="absolute right-0 top-11 z-50 w-48 rounded-2xl border border-black/5 bg-white p-1.5 text-sm text-text shadow-lg">
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
        )}
      </div>
    </header>
  );
}
