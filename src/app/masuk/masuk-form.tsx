"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { AuthBenefitsPanel } from "@/components/auth-benefits-panel";

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
    <main className="grid min-h-[calc(100vh-64px)] lg:grid-cols-2">
      {/* Form */}
      <div className="order-1 flex items-center justify-center px-6 py-12 lg:order-2">
        <div className="w-full max-w-sm">
          <div className="mb-6 flex flex-col items-center text-center">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-lg font-bold text-white">
              N
            </span>
            <h1 className="mt-3 text-xl font-bold text-text">Masuk ke Nemshi</h1>
            <p className="mt-1 text-sm text-text-secondary">
              Masuk untuk menawarkan jasa atau mencari jasa yang kamu butuhkan.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <label className="flex flex-col gap-1 text-sm text-text-secondary">
              Email
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-lg border border-black/10 px-3 py-2 text-text outline-none focus:border-accent focus:ring-4 focus:ring-accent/10"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm text-text-secondary">
              Kata Sandi
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="rounded-lg border border-black/10 px-3 py-2 text-text outline-none focus:border-accent focus:ring-4 focus:ring-accent/10"
              />
            </label>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <button
              type="submit"
              disabled={submitting}
              className="rounded-full mt-2 bg-primary px-5 py-3 font-semibold text-white transition-colors hover:bg-primary-dark disabled:opacity-60"
            >
              {submitting ? "Masuk..." : "Masuk"}
            </button>
          </form>

          <div className="mt-5 flex flex-col gap-2 text-center text-sm text-text-secondary">
            <Link href="/lupa-password" className="font-medium text-accent hover:underline">
              Lupa kata sandi?
            </Link>
            <p>
              Belum punya akun?{" "}
              <Link href="/daftar" className="font-medium text-accent hover:underline">
                Daftar di sini
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Benefit panel */}
      <AuthBenefitsPanel className="order-2 lg:order-1" />
    </main>
  );
}
