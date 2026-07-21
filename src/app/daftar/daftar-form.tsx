"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { EmergencyContactFields, type EmergencyContact } from "@/components/emergency-contact-fields";

export function DaftarForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") ?? "/";

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"Pelanggan" | "Penyedia_Jasa">("Pelanggan");
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([
    { fullName: "", phoneNumber: "" },
  ]);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    const supabase = createClient();
    const { data, error: signUpError } = await supabase.auth.signUp({ email, password });

    if (signUpError || !data.user) {
      // Tidak mengungkap apakah email sudah terdaftar, demi keamanan.
      setError("Email tidak tersedia atau kata sandi tidak valid.");
      setSubmitting(false);
      return;
    }

    const bootstrapResponse = await fetch("/api/auth/bootstrap-profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fullName, role, emergencyContacts }),
    });

    setSubmitting(false);

    if (!bootstrapResponse.ok) {
      const data = await bootstrapResponse.json().catch(() => null);
      setError(data?.error ?? "Akun dibuat, tetapi profil gagal disiapkan. Coba masuk secara manual.");
      return;
    }

    router.push(redirectTo);
    router.refresh();
  }

  return (
    <main className="mx-auto max-w-sm px-4 py-12 sm:px-6">
      <h1 className="mb-6 text-2xl font-bold text-text">Daftar Akun Nemshi</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <label className="flex flex-col gap-1 text-sm text-text-secondary">
          Nama Lengkap
          <input
            type="text"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="rounded-xl border border-black/10 px-3 py-2 text-text outline-none focus:border-primary"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm text-text-secondary">
          Email
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-xl border border-black/10 px-3 py-2 text-text outline-none focus:border-primary"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm text-text-secondary">
          Kata Sandi
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded-xl border border-black/10 px-3 py-2 text-text outline-none focus:border-primary"
          />
        </label>

        <div className="flex flex-col gap-1 text-sm text-text-secondary">
          Daftar sebagai
          <div className="flex gap-3">
            <label className="flex items-center gap-2 rounded-xl border border-black/10 px-3 py-2">
              <input
                type="radio"
                name="role"
                checked={role === "Pelanggan"}
                onChange={() => setRole("Pelanggan")}
              />
              Pelanggan
            </label>
            <label className="flex items-center gap-2 rounded-xl border border-black/10 px-3 py-2">
              <input
                type="radio"
                name="role"
                checked={role === "Penyedia_Jasa"}
                onChange={() => setRole("Penyedia_Jasa")}
              />
              Penyedia Jasa
            </label>
          </div>
        </div>

        <EmergencyContactFields contacts={emergencyContacts} onChange={setEmergencyContacts} />

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="mt-2 rounded-xl bg-primary px-5 py-3 font-semibold text-white disabled:opacity-60"
        >
          {submitting ? "Mendaftar..." : "Daftar"}
        </button>
      </form>

      <p className="mt-4 text-sm text-text-secondary">
        Sudah punya akun?{" "}
        <Link href="/masuk" className="font-medium text-primary hover:underline">
          Masuk di sini
        </Link>
      </p>
    </main>
  );
}
