import Link from "next/link";

export function PublicNav() {
  return (
    <div className="sticky top-0 z-40 flex justify-center px-4 pt-4 sm:px-6">
      <Link
        href="/"
        className="flex items-center gap-2 rounded-pill border-[2.5px] border-ink bg-white px-5 py-2.5 text-lg font-bold tracking-tight text-charcoal shadow-[3px_3px_0_0_rgba(20,20,20,1)]"
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-ink bg-brand text-[15px] font-bold text-charcoal">
          N
        </span>
        Nemshi
      </Link>
    </div>
  );
}
