"use client";

import { useEffect, useState } from "react";

const SESSION_SKIP_KEY = "nemshi:onboarding-skipped";

const inputClass =
  "h-11 w-full rounded-input border border-border bg-white px-4 text-[14px] text-charcoal placeholder:text-muted focus:border-cta focus:outline-none focus:ring-3 focus:ring-cta/10";
const labelClass = "text-[12px] font-bold text-muted-foreground";

interface ProfileResponse {
  name?: string;
  whatsappNumber?: string | null;
  location?: string | null;
  onboardingCompleted?: boolean;
}

export function OnboardingModal() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [location, setLocation] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (sessionStorage.getItem(SESSION_SKIP_KEY)) return;

    fetch("/api/profile")
      .then((res) => (res.ok ? res.json() : null))
      .then((data: ProfileResponse | null) => {
        if (!data) return;
        if (!data.onboardingCompleted) {
          setName(data.name ?? "");
          setWhatsappNumber(data.whatsappNumber ?? "");
          setLocation(data.location ?? "");
          setOpen(true);
        }
      })
      .catch(() => {});
  }, []);

  function skip() {
    sessionStorage.setItem(SESSION_SKIP_KEY, "1");
    setOpen(false);
  }

  async function handleSave() {
    if (!name.trim() || !whatsappNumber.trim() || !location.trim()) {
      setError("Semua kolom wajib diisi.");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          whatsappNumber: whatsappNumber.trim(),
          location: location.trim(),
          onboardingCompleted: true,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Gagal menyimpan profil.");
      }

      setOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menyimpan profil.");
    } finally {
      setSaving(false);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/50 px-4">
      <div className="w-full max-w-md rounded-card border-[2.5px] border-ink bg-white p-6 shadow-[5px_5px_0_0_rgba(20,20,20,1)]">
        <h2 className="text-xl font-bold text-charcoal">Lengkapi Profilmu</h2>
        <p className="mt-1 text-[14px] font-normal text-muted-foreground">
          Biar pengguna lain tahu harus menghubungi siapa saat bertransaksi
          denganmu.
        </p>

        <div className="mt-5 flex flex-col gap-4">
          <div>
            <label className={labelClass} htmlFor="onboard-name">
              Nama
            </label>
            <input
              id="onboard-name"
              className={`mt-1 ${inputClass}`}
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="onboard-wa">
              Nomor WhatsApp
            </label>
            <input
              id="onboard-wa"
              className={`mt-1 ${inputClass}`}
              placeholder="Contoh: 6281234567890"
              value={whatsappNumber}
              onChange={(event) => setWhatsappNumber(event.target.value)}
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="onboard-location">
              Lokasi
            </label>
            <input
              id="onboard-location"
              className={`mt-1 ${inputClass}`}
              placeholder="Contoh: Hay Asyir"
              value={location}
              onChange={(event) => setLocation(event.target.value)}
            />
          </div>
        </div>

        {error && (
          <p className="mt-3 text-[14px] font-normal text-error">{error}</p>
        )}

        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={skip}
            className="h-11 flex-1 rounded-pill border-2 border-ink text-base font-bold text-charcoal transition-colors hover:bg-surface"
          >
            Nanti Saja
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="h-11 flex-1 rounded-pill bg-charcoal text-base font-bold text-white transition-colors hover:bg-black disabled:opacity-60"
          >
            {saving ? "Menyimpan..." : "Simpan"}
          </button>
        </div>
      </div>
    </div>
  );
}
