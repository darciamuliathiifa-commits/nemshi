"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("Kata sandi minimal 6 karakter.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Konfirmasi kata sandi tidak cocok.");
      return;
    }

    setSubmitting(true);
    const supabase = createClient();
    // Supabase otomatis membaca sesi pemulihan dari tautan email di URL.
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setSubmitting(false);

    if (updateError) {
      setError("Gagal mengubah kata sandi. Tautan mungkin sudah kedaluwarsa.");
      return;
    }

    setSuccess(true);
    setTimeout(() => router.push("/masuk"), 2000);
  }

  if (success) {
    return (
      <main className="mx-auto max-w-sm px-4 py-12 sm:px-6">
        <h1 className="mb-2 text-2xl font-bold text-text">Kata Sandi Berhasil Diubah</h1>
        <p className="text-text-secondary">
          Kamu sekarang bisa masuk dengan kata sandi baru. Mengarahkan ke halaman Masuk...
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-sm px-4 py-12 sm:px-6">
      <h1 className="mb-6 text-2xl font-bold text-text">Buat Kata Sandi Baru</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <label className="flex flex-col gap-1 text-sm text-text-secondary">
          Kata Sandi Baru
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded-xl border border-black/10 px-3 py-2 text-text outline-none focus:border-primary"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm text-text-secondary">
          Konfirmasi Kata Sandi
          <input
            type="password"
            required
            minLength={6}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="rounded-xl border border-black/10 px-3 py-2 text-text outline-none focus:border-primary"
          />
        </label>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="mt-2 rounded-xl bg-primary px-5 py-3 font-semibold text-white disabled:opacity-60"
        >
          {submitting ? "Menyimpan..." : "Simpan"}
        </button>
      </form>
    </main>
  );
}
