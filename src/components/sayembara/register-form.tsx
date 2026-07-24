"use client";

import { useState } from "react";
import Link from "next/link";

const inputClass =
  "h-11 w-full rounded-input border border-border bg-white px-4 text-[14px] text-charcoal placeholder:text-muted focus:border-cta focus:outline-none focus:ring-3 focus:ring-cta/10";
const labelClass = "text-[12px] font-bold text-muted-foreground";

export function RegisterForm({
  sayembaraId,
  sayembaraTitle,
}: {
  sayembaraId: string;
  sayembaraTitle: string;
}) {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const canSubmit = name.trim() !== "" && contact.trim() !== "";

  async function handleSubmit() {
    setSubmitting(true);
    setSubmitError(null);

    try {
      const res = await fetch(`/api/sayembara/${sayembaraId}/applicants`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, contact }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.error ?? "Gagal mendaftar.");
      }

      setSubmitted(true);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Gagal mendaftar.");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center rounded-card border-[2.5px] border-ink bg-white shadow-[3px_3px_0_0_rgba(20,20,20,1)] p-10 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-success/10 text-2xl text-success">
          ✓
        </span>
        <h2 className="mt-4 text-xl font-bold text-charcoal">
          Pendaftaran Terkirim
        </h2>
        <p className="mt-2 max-w-sm text-[14px] font-normal text-muted-foreground">
          Kamu berhasil mendaftar sebagai calon penyedia jasa untuk sayembara
          ini. Pemilik sayembara akan menghubungimu jika cocok.
        </p>
        <Link
          href={`/sayembara/${sayembaraId}`}
          className="mt-6 flex h-11 w-full max-w-xs items-center justify-center rounded-pill bg-charcoal text-base font-bold text-white transition-colors hover:bg-black"
        >
          Kembali ke Detail Sayembara
        </Link>
      </div>
    );
  }

  return (
    <div className="rounded-card border-[2.5px] border-ink bg-white shadow-[3px_3px_0_0_rgba(20,20,20,1)] p-6">
      <p className="text-[12px] font-bold text-muted-foreground">
        Mendaftar untuk
      </p>
      <p className="mt-1 text-base font-bold text-charcoal">
        {sayembaraTitle}
      </p>

      <form className="mt-5 flex flex-col gap-4">
        <div>
          <label className={labelClass} htmlFor="name">
            Nama Lengkap
          </label>
          <input
            id="name"
            className={`mt-1 ${inputClass}`}
            placeholder="Nama lengkap kamu"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </div>

        <div>
          <label className={labelClass} htmlFor="contact">
            Kontak (WhatsApp)
          </label>
          <input
            id="contact"
            className={`mt-1 ${inputClass}`}
            placeholder="Contoh: 20 10 1234 5678"
            value={contact}
            onChange={(event) => setContact(event.target.value)}
          />
        </div>
      </form>

      {submitError && (
        <p className="mt-3 text-[14px] font-normal text-error">{submitError}</p>
      )}

      <button
        type="button"
        disabled={!canSubmit || submitting}
        onClick={handleSubmit}
        className="mt-5 flex h-11 w-full items-center justify-center rounded-pill bg-charcoal text-base font-bold text-white transition-colors hover:bg-black disabled:bg-muted disabled:text-[#707070]"
      >
        {submitting ? "Mendaftar..." : "Daftar"}
      </button>
    </div>
  );
}
