import Link from "next/link";
import Image from "next/image";
import { CompassIcon } from "@/components/icons";

export function PublicNav() {
  return (
    <div className="sticky top-0 z-40 flex items-center justify-center gap-2 px-4 pt-4 sm:gap-3 sm:px-6">
      <Image
        src="/flag-indonesia.png"
        alt=""
        width={1161}
        height={787}
        aria-hidden
        className="w-7 shrink-0 -rotate-6 animate-[float-c_5s_ease-in-out_infinite] select-none sm:w-10"
      />

      <Link
        href="/jelajahi"
        className="flex shrink-0 items-center gap-2 whitespace-nowrap rounded-pill border-[2.5px] border-ink bg-white px-4 py-2.5 text-base font-bold tracking-tight text-charcoal shadow-[3px_3px_0_0_rgba(20,20,20,1)]"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-ink bg-brand text-[14px] font-bold text-charcoal">
          N
        </span>
        Ayo Jelajahi
        <CompassIcon width={17} height={17} />
      </Link>

      <Image
        src="/flag-mesir.png"
        alt=""
        width={1161}
        height={787}
        aria-hidden
        className="w-7 shrink-0 rotate-6 animate-[float-d_5.5s_ease-in-out_infinite] select-none sm:w-10"
      />
    </div>
  );
}
