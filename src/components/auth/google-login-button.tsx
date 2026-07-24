"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { GoogleLogo } from "@/components/icons/google-logo";

export function GoogleLoginButton({ compact = false }: { compact?: boolean }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLogin() {
    if (!supabase) {
      setError("Login belum dikonfigurasi. Coba lagi nanti.");
      return;
    }

    setLoading(true);
    setError(null);

    const { error: authError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (authError) {
      setError("Gagal masuk dengan Google. Coba lagi.");
      setLoading(false);
    }
  }

  return (
    <div className={`flex flex-col ${compact ? "items-end" : "items-center"} gap-2`}>
      <button
        type="button"
        onClick={handleLogin}
        disabled={loading}
        className={`flex shrink-0 items-center justify-center gap-2.5 whitespace-nowrap rounded-pill bg-charcoal font-bold text-white transition-colors hover:bg-black disabled:opacity-60 ${
          compact ? "h-10 pl-3 pr-5 text-[14px]" : "h-12 pl-4 pr-7 text-base"
        }`}
      >
        <span
          className={`flex items-center justify-center rounded-full bg-white ${
            compact ? "h-6 w-6" : "h-7 w-7"
          }`}
        >
          <GoogleLogo width={compact ? 14 : 16} height={compact ? 14 : 16} />
        </span>
        {loading ? "Menghubungkan..." : "Masuk dengan Google"}
      </button>
      {error && <p className="text-[14px] font-normal text-error">{error}</p>}
    </div>
  );
}
