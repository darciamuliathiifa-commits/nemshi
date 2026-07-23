"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function AuthNav() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    fetch("/api/me").then((response) => setIsLoggedIn(response.ok));
  }, []);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    setIsLoggedIn(false);
    router.push("/");
    router.refresh();
  }

  if (isLoggedIn === null) {
    return null;
  }

  if (!isLoggedIn) {
    return (
      <div className="flex shrink-0 gap-4 text-sm text-text">
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
    );
  }

  return (
    <div className="flex shrink-0 items-center gap-4 text-sm text-text">
      <Link href="/iklan-saya" className="hidden transition-colors hover:text-accent sm:inline">
        Iklan Saya
      </Link>
      <Link href="/tersimpan" className="hidden transition-colors hover:text-accent sm:inline">
        Tersimpan
      </Link>
      <Link href="/akun" className="hidden transition-colors hover:text-accent sm:inline">
        Akun Saya
      </Link>
      <button onClick={handleLogout} className="hidden transition-colors hover:text-accent sm:inline">
        Keluar
      </button>
      <Link
        href="/pasang-iklan"
        className="rounded-full bg-primary px-4 py-1.5 font-medium text-white transition-colors hover:bg-primary-dark"
      >
        Pasang Iklan
      </Link>
    </div>
  );
}
