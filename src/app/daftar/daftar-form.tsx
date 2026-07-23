"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { EmergencyContactFields, type EmergencyContact } from "@/components/emergency-contact-fields";
import { AuthBenefitsPanel } from "@/components/auth-benefits-panel";

export function DaftarForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") ?? "/jelajahi";

  const [step, setStep] = useState<"form" | "otp">("form");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"Pelanggan" | "Penyedia_Jasa">("Pelanggan");
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([
    { fullName: "", phoneNumber: "" },
  ]);
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function bootstrapAndRedirect() {
    const bootstrapResponse = await fetch("/api/auth/bootstrap-profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fullName, role, emergencyContacts }),
    });

    if (!bootstrapResponse.ok) {
      const data = await bootstrapResponse.json().catch(() => null);
      setError(data?.error ?? "Akun dibuat, tetapi profil gagal disiapkan. Coba masuk secara manual.");
      return;
    }

    router.push(redirectTo);
    router.refresh();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setInfo("");
    setSubmitting(true);

    const supabase = createClient();
    const { data, error: signUpError } = await supabase.auth.signUp({ email, password });

    if (signUpError || !data.user) {
      setError("Email tidak tersedia atau kata sandi tidak valid.");
      setSubmitting(false);
      return;
    }

    // Jika verifikasi email dimatikan, sesi langsung aktif — tak perlu OTP.
    if (data.session) {
      await bootstrapAndRedirect();
      setSubmitting(false);
      return;
    }

    // Verifikasi email aktif: minta kode OTP yang dikirim ke email.
    setStep("otp");
    setInfo(`Kami kirim kode 6 digit ke ${email}. Masukkan di bawah.`);
    setSubmitting(false);
  }

  async function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    const supabase = createClient();
    const { error: verifyError } = await supabase.auth.verifyOtp({
      email,
      token: otp.trim(),
      type: "signup",
    });

    if (verifyError) {
      setError("Kode OTP salah atau sudah kedaluwarsa.");
      setSubmitting(false);
      return;
    }

    await bootstrapAndRedirect();
    setSubmitting(false);
  }

  async function handleResend() {
    setError("");
    setInfo("");
    const supabase = createClient();
    const { error: resendError } = await supabase.auth.resend({ type: "signup", email });
    setInfo(resendError ? "" : "Kode baru sudah dikirim ulang.");
    if (resendError) setError("Gagal mengirim ulang kode. Coba lagi sebentar.");
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
            <h1 className="mt-3 text-xl font-bold text-text">
              {step === "form" ? "Daftar Akun Nemshi" : "Verifikasi Email"}
            </h1>
            <p className="mt-1 text-sm text-text-secondary">
              {step === "form"
                ? "Gratis, hanya butuh beberapa menit."
                : info || `Masukkan kode 6 digit yang dikirim ke ${email}.`}
            </p>
          </div>

          {step === "form" ? (
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <label className="flex flex-col gap-1 text-sm text-text-secondary">
                Nama Lengkap
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="rounded-lg border border-black/10 px-3 py-2 text-text outline-none focus:border-accent focus:ring-4 focus:ring-accent/10"
                />
              </label>
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
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="rounded-lg border border-black/10 px-3 py-2 text-text outline-none focus:border-accent focus:ring-4 focus:ring-accent/10"
                />
              </label>

              <div className="flex flex-col gap-1 text-sm text-text-secondary">
                Daftar sebagai
                <div className="flex gap-3">
                  <label className="flex items-center gap-2 rounded-xl border border-black/10 px-3 py-2">
                    <input
                      type="radio"
                      name="role"
                      className="accent-accent"
                      checked={role === "Pelanggan"}
                      onChange={() => setRole("Pelanggan")}
                    />
                    Pelanggan
                  </label>
                  <label className="flex items-center gap-2 rounded-xl border border-black/10 px-3 py-2">
                    <input
                      type="radio"
                      name="role"
                      className="accent-accent"
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
                className="rounded-full mt-2 bg-primary px-5 py-3 font-semibold text-white transition-colors hover:bg-primary-dark disabled:opacity-60"
              >
                {submitting ? "Memproses..." : "Daftar"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="flex flex-col gap-3">
              <label className="flex flex-col gap-1 text-sm text-text-secondary">
                Kode OTP
                <input
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="123456"
                  className="rounded-lg border border-black/10 px-3 py-2 text-center text-lg tracking-[0.4em] text-text outline-none focus:border-accent focus:ring-4 focus:ring-accent/10"
                />
              </label>

              {error && <p className="text-sm text-red-600">{error}</p>}

              <button
                type="submit"
                disabled={submitting}
                className="rounded-full mt-2 bg-primary px-5 py-3 font-semibold text-white transition-colors hover:bg-primary-dark disabled:opacity-60"
              >
                {submitting ? "Memverifikasi..." : "Verifikasi & Masuk"}
              </button>

              <div className="flex items-center justify-between text-sm text-text-secondary">
                <button type="button" onClick={handleResend} className="font-medium text-accent hover:underline">
                  Kirim ulang kode
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setStep("form");
                    setError("");
                    setInfo("");
                  }}
                  className="hover:text-text"
                >
                  ← Ubah data
                </button>
              </div>
            </form>
          )}

          <p className="mt-5 text-center text-sm text-text-secondary">
            Sudah punya akun?{" "}
            <Link href="/masuk" className="font-medium text-accent hover:underline">
              Masuk di sini
            </Link>
          </p>
        </div>
      </div>

      {/* Benefit panel */}
      <AuthBenefitsPanel className="order-2 lg:order-1" />
    </main>
  );
}
