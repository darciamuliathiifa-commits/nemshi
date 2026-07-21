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
      <div className="flex shrink-0 gap-4 text-sm font-medium text-primary">
        <Link href="/masuk" className="hover:underline">
          Masuk
        </Link>
        <Link href="/daftar" className="hover:underline">
          Daftar
        </Link>
      </div>
    );
  }

  return (
    <div className="flex shrink-0 gap-4 text-sm font-medium text-primary">
      <Link href="/pasang-iklan" className="hover:underline">
        Pasang Iklan
      </Link>
      <Link href="/iklan-saya" className="hover:underline">
        Iklan Saya
      </Link>
      <Link href="/akun" className="hover:underline">
        Akun Saya
      </Link>
      <button onClick={handleLogout} className="hover:underline">
        Keluar
      </button>
    </div>
  );
}
