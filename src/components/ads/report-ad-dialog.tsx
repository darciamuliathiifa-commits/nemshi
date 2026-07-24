"use client";

import { useState } from "react";
import { CloseIcon } from "@/components/icons";

const REPORT_REASONS = [
  "Spam atau iklan berulang",
  "Penipuan",
  "Konten terlarang atau tidak pantas",
  "Informasi menyesatkan",
  "Lainnya",
];

type DialogStep = "form" | "submitting" | "success";

export function ReportAdDialog({ adTitle }: { adTitle: string }) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<DialogStep>("form");
  const [reason, setReason] = useState("");
  const [detail, setDetail] = useState("");

  function closeAndReset() {
    setOpen(false);
    setStep("form");
    setReason("");
    setDetail("");
  }

  async function handleSubmit() {
    if (!reason) return;
    setStep("submitting");
    await new Promise((resolve) => setTimeout(resolve, 600));
    setStep("success");
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="h-9 rounded-pill px-4 text-[14px] font-bold text-error transition-colors hover:bg-error/10"
      >
        Laporkan iklan ini
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button
            type="button"
            aria-label="Tutup"
            onClick={closeAndReset}
            className="absolute inset-0 bg-ink/40"
          />

          <div className="relative w-full max-w-md rounded-card border border-border-subtle bg-white p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-charcoal">
                Laporkan Iklan
              </h2>
              <button
                type="button"
                aria-label="Tutup"
                onClick={closeAndReset}
                className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-surface"
              >
                <CloseIcon width={16} height={16} />
              </button>
            </div>

            {step !== "success" ? (
              <>
                <p className="mt-1 truncate text-[14px] font-normal text-muted-foreground">
                  {adTitle}
                </p>

                <div className="mt-4 flex flex-col gap-2">
                  {REPORT_REASONS.map((option) => (
                    <label
                      key={option}
                      className="flex items-center gap-2 rounded-input border border-border px-3 py-2.5 text-[14px] text-charcoal has-[:checked]:border-cta has-[:checked]:bg-cta/5"
                    >
                      <input
                        type="radio"
                        name="report-reason"
                        value={option}
                        checked={reason === option}
                        onChange={(event) => setReason(event.target.value)}
                        className="h-4 w-4 accent-cta"
                      />
                      {option}
                    </label>
                  ))}
                </div>

                <label className="mt-4 block text-[12px] font-bold text-muted-foreground">
                  Detail tambahan (opsional)
                  <textarea
                    rows={3}
                    value={detail}
                    onChange={(event) => setDetail(event.target.value)}
                    placeholder="Jelaskan lebih lanjut jika perlu"
                    className="mt-1 w-full resize-none rounded-input border border-border bg-white px-3 py-2 text-[14px] font-normal text-charcoal placeholder:text-muted focus:border-cta focus:outline-none focus:ring-3 focus:ring-cta/10"
                  />
                </label>

                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={!reason || step === "submitting"}
                  className="mt-5 flex h-11 w-full items-center justify-center rounded-pill bg-charcoal text-base font-bold text-white transition-colors hover:bg-black disabled:bg-muted disabled:text-[#707070]"
                >
                  {step === "submitting" ? "Mengirim..." : "Kirim Laporan"}
                </button>
              </>
            ) : (
              <div className="mt-4 flex flex-col items-center text-center">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-success/10 text-xl text-success">
                  ✓
                </span>
                <p className="mt-3 text-base font-normal text-charcoal">
                  Laporan terkirim. Tim kami akan meninjau iklan ini.
                </p>
                <button
                  type="button"
                  onClick={closeAndReset}
                  className="mt-5 h-10 w-full rounded-pill border border-border-strong text-[14px] font-bold text-charcoal transition-colors hover:bg-surface"
                >
                  Tutup
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
