"use client";

import { useEffect, useState } from "react";

const REASON_OPTIONS: { value: string; label: string }[] = [
  { value: "Penipuan", label: "Penipuan" },
  { value: "Informasi_Palsu", label: "Informasi palsu" },
  { value: "Spam", label: "Spam" },
  { value: "Konten_Tidak_Pantas", label: "Konten tidak pantas" },
  { value: "Lainnya", label: "Lainnya" },
];

export function ReportListingButton({ listingId }: { listingId: string }) {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState(REASON_OPTIONS[0].value);
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    fetch("/api/me").then((response) => setIsLoggedIn(response.ok));
  }, []);

  async function handleSubmit() {
    setSubmitting(true);
    await fetch("/api/reports", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ listingId, reason, description }),
    });
    setSubmitting(false);
    setSubmitted(true);
  }

  if (!isLoggedIn) {
    return null;
  }

  if (submitted) {
    return (
      <p className="text-sm text-text-secondary">
        Laporanmu telah diterima dan sedang ditinjau oleh admin. Terima kasih telah membantu
        menjaga keamanan komunitas Nemshi.
      </p>
    );
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="text-sm font-medium text-text-secondary underline hover:text-red-600"
      >
        Laporkan iklan ini
      </button>
    );
  }

  return (
    <div className="rounded-xl border border-black/10 bg-white p-4">
      <h3 className="mb-3 text-sm font-semibold text-text">Laporkan Iklan Ini</h3>
      <label className="mb-3 flex flex-col gap-1 text-sm text-text-secondary">
        Alasan
        <select
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="rounded-xl border border-black/10 px-3 py-2 text-text outline-none focus:border-primary"
        >
          {REASON_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
      <label className="mb-4 flex flex-col gap-1 text-sm text-text-secondary">
        Keterangan tambahan (opsional)
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="resize-none rounded-xl border border-black/10 px-3 py-2 text-text outline-none focus:border-primary"
          placeholder="Jelaskan detail yang membuatmu mencurigai iklan ini..."
        />
      </label>
      <div className="flex gap-2">
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
        >
          {submitting ? "Mengirim..." : "Kirim Laporan"}
        </button>
        <button
          onClick={() => setOpen(false)}
          className="rounded-xl border border-black/10 px-4 py-2 text-sm font-medium text-text-secondary hover:bg-black/5"
        >
          Batal
        </button>
      </div>
    </div>
  );
}
