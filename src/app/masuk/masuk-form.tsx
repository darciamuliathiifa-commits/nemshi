"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { AuthShell } from "@/components/auth-shell";

export function MasukForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") ?? "/jelajahi";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });

    setSubmitting(false);

    if (signInError) {
      setError("Email atau kata sandi salah.");
      return;
    }

    router.push(redirectTo);
    router.refresh();
  }

  return (
    <AuthShell title="Masuk ke Nemshi" subtitle="Direktori jasa untuk Masisir di Mesir">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <label className="flex flex-col gap-1 text-sm text-text-secondary">
          Email
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-black/10 px-3 py-2 text-text outline-none focus:border-accent"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm text-text-secondary">
          Kata Sandi
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-black/10 px-3 py-2 text-text outline-none focus:border-accent"
          />
        </label>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="mt-2 bg-primary px-5 py-3 font-semibold text-white transition-colors hover:bg-primary-dark disabled:opacity-60"
        >
          {submitting ? "Masuk..." : "Masuk"}
        </button>
      </form>

      <div className="mt-5 flex flex-col gap-2 text-center text-sm text-text-secondary">
        <Link href="/lupa-password" className="font-medium text-primary hover:underline">
          Lupa kata sandi?
        </Link>
        <p>
          Belum punya akun?{" "}
          <Link href="/daftar" className="font-medium text-primary hover:underline">
            Daftar di sini
          </Link>
        </p>
      </div>
    </AuthShell>
  );
}
