"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { GoogleLogo } from "@/components/icons/google-logo";

async function signInWithGoogle(next?: string) {
  if (!supabase) {
    return "Login belum dikonfigurasi. Coba lagi nanti.";
  }

  // Carry the button's intent through the OAuth round-trip. Without this every
  // CTA lands on /jelajahi, so someone who pressed "Pasang iklan" gets dropped
  // into the browse page instead of the form they asked for.
  const callback = new URL("/auth/callback", window.location.origin);
  if (next) callback.searchParams.set("next", next);

  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: callback.toString(),
    },
  });

  return error ? "Gagal masuk dengan Google. Coba lagi." : null;
}

export function LandingLoginButton({
  children,
  className,
  ariaLabel,
  title,
  next,
}: {
  children: ReactNode;
  className: string;
  ariaLabel?: string;
  title?: string;
  /** Where to land after login — should match what the button says it does. */
  next?: string;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLogin() {
    setLoading(true);
    setError(null);

    const loginError = await signInWithGoogle(next);
    if (loginError) {
      setError(loginError);
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleLogin}
      disabled={loading}
      aria-label={ariaLabel}
      title={error ?? title}
      className={`${className} disabled:cursor-wait disabled:opacity-65`}
    >
      {loading ? "Menghubungkan..." : error ? "Coba login lagi" : children}
    </button>
  );
}

export function GoogleLoginButton({
  compact = false,
  landing = false,
}: {
  compact?: boolean;
  landing?: boolean;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLogin() {
    setLoading(true);
    setError(null);

    const loginError = await signInWithGoogle();
    if (loginError) {
      setError(loginError);
      setLoading(false);
    }
  }

  return (
    <div className={`flex flex-col ${compact ? "items-end" : "items-center"} gap-2`}>
      <button
        type="button"
        onClick={handleLogin}
        disabled={loading}
        className={`flex shrink-0 items-center justify-center gap-2.5 whitespace-nowrap rounded-pill font-bold transition-colors disabled:opacity-60 ${
          landing
            ? "bg-transparent text-[#005b4f] hover:bg-[#005b4f]/8"
            : "bg-charcoal text-white hover:bg-black"
        } ${
          compact
            ? "h-10 pl-3 pr-5 text-[14px]"
            : landing
              ? "h-10 px-3 text-sm"
              : "h-12 pl-4 pr-7 text-base"
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
