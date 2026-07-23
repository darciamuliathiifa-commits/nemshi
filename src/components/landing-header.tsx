"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

type Profile = { fullName: string | null; avatarUrl: string | null };

const NAV_LINKS = [
  { href: "/jelajahi", label: "Jelajahi Jasa" },
  { href: "/sayembara", label: "Cari Jasa" },
  { href: "/kategori", label: "Kategori" },
];

export function LandingHeader() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    fetch("/api/me").then(async (response) => {
      setIsLoggedIn(response.ok);
      if (response.ok) setProfile(await response.json());
    });
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-black/5 bg-white/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary text-sm font-bold text-white">
            N
          </span>
          <span className="text-lg font-semibold tracking-tight text-text">Nemshi</span>
        </Link>

        <nav className="hidden items-center gap-7 text-sm text-text md:flex">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="transition-colors hover:text-accent">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-3 text-sm">
          {isLoggedIn === false && (
            <>
              <Link href="/masuk" className="font-medium text-text transition-colors hover:text-accent">
                Masuk
              </Link>
              <Link
                href="/daftar"
                className="rounded-full bg-primary px-4 py-1.5 font-semibold text-white transition-colors hover:bg-primary-dark"
              >
                Daftar
              </Link>
            </>
          )}

          {isLoggedIn && (
            <>
              <Link
                href="/jelajahi"
                className="rounded-full bg-primary px-4 py-1.5 font-semibold text-white transition-colors hover:bg-primary-dark"
              >
                Buka Aplikasi
              </Link>
              <Link
                href="/akun"
                aria-label="Akun Saya"
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
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
