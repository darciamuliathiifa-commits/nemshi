import Link from "next/link";

export function QuotaExceededModal({
  onClose,
  message,
}: {
  onClose: () => void;
  message: string;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 px-6">
      <div className="w-full max-w-sm rounded-card border-[2.5px] border-ink bg-white p-6 text-center shadow-[5px_5px_0_0_rgba(20,20,20,1)]">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand text-2xl">
          ⚡
        </span>
        <h2 className="mt-4 text-xl font-bold text-charcoal">
          Kuota Kamu Habis
        </h2>
        <p className="mt-2 text-[14px] font-normal leading-5 text-muted-foreground">
          {message}
        </p>

        <div className="mt-6 flex flex-col gap-2">
          <Link
            href="/paket-plus"
            className="flex h-11 items-center justify-center rounded-pill border-2 border-ink text-[14px] font-bold text-charcoal transition-colors hover:bg-surface"
          >
            Lihat Paket Hemat — Rp 99.000
          </Link>
          <Link
            href="/paket-plus"
            className="flex h-11 items-center justify-center rounded-pill bg-charcoal text-[14px] font-bold text-white transition-colors hover:bg-black"
          >
            Lihat Paket Plus — Rp 150.000
          </Link>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="mt-4 text-[13px] font-bold text-muted-foreground hover:text-charcoal"
        >
          Nanti dulu
        </button>
      </div>
    </div>
  );
}
