"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { AuthShell } from "@/components/auth-shell";

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
      <AuthShell title="Kata Sandi Berhasil Diubah">
        <p className="text-center text-sm text-text-secondary">
          Kamu sekarang bisa masuk dengan kata sandi baru. Mengarahkan ke halaman Masuk...
        </p>
      </AuthShell>
    );
  }

  return (
    <AuthShell title="Buat Kata Sandi Baru">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <label className="flex flex-col gap-1 text-sm text-text-secondary">
          Kata Sandi Baru
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-black/10 px-3 py-2 text-text outline-none focus:border-accent"
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
            className="border border-black/10 px-3 py-2 text-text outline-none focus:border-accent"
          />
        </label>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="mt-2 bg-primary px-5 py-3 font-semibold text-white transition-colors hover:bg-primary-dark disabled:opacity-60"
        >
          {submitting ? "Menyimpan..." : "Simpan"}
        </button>
      </form>
    </AuthShell>
  );
}
