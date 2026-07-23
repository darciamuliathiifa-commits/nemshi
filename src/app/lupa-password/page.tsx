"use client";

import Link from "next/link";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { AuthShell } from "@/components/auth-shell";

export default function LupaPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);

    const supabase = createClient();
    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    // Selalu tampilkan pesan yang sama, terlepas dari apakah email terdaftar
    // atau tidak, demi keamanan (tidak mengungkap keberadaan akun).
    setSubmitting(false);
    setSubmitted(true);
  }

  return (
    <AuthShell title="Atur Ulang Kata Sandi" subtitle="Kami akan kirim tautan lewat email">
      {submitted ? (
        <p className="text-sm text-text-secondary">
          Jika email tersebut terdaftar, tautan atur ulang kata sandi telah dikirim. Silakan cek
          inbox (atau folder spam) dan ikuti tautannya.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <label className="flex flex-col gap-1 text-sm text-text-secondary">
            Email Terdaftar
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border border-black/10 px-3 py-2 text-text outline-none focus:border-accent"
            />
          </label>
          <button
            type="submit"
            disabled={submitting}
            className="mt-2 bg-primary px-5 py-3 font-semibold text-white transition-colors hover:bg-primary-dark disabled:opacity-60"
          >
            {submitting ? "Mengirim..." : "Kirim Tautan Atur Ulang"}
          </button>
        </form>
      )}

      <p className="mt-5 text-center text-sm text-text-secondary">
        <Link href="/masuk" className="font-medium text-primary hover:underline">
          ← Kembali ke halaman Masuk
        </Link>
      </p>
    </AuthShell>
  );
}
