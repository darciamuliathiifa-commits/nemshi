import { ChevronLeftIcon, ChevronRightIcon } from "@/components/icons";

export function Pagination({
  page,
  totalPages,
  onChange,
}: {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="mt-8 flex flex-wrap items-center justify-center gap-1.5">
      <button
        type="button"
        onClick={() => onChange(Math.max(1, page - 1))}
        disabled={page === 1}
        aria-label="Halaman sebelumnya"
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-ink text-charcoal transition-colors hover:bg-surface disabled:opacity-40"
      >
        <ChevronLeftIcon width={16} height={16} />
      </button>

      {pages.map((p) => (
        <button
          key={p}
          type="button"
          onClick={() => onChange(p)}
          aria-current={p === page ? "page" : undefined}
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[13px] font-bold transition-colors ${
            p === page
              ? "bg-charcoal text-white"
              : "border-2 border-ink text-charcoal hover:bg-surface"
          }`}
        >
          {p}
        </button>
      ))}

      <button
        type="button"
        onClick={() => onChange(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
        aria-label="Halaman berikutnya"
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-ink text-charcoal transition-colors hover:bg-surface disabled:opacity-40"
      >
        <ChevronRightIcon width={16} height={16} />
      </button>
    </div>
  );
}
