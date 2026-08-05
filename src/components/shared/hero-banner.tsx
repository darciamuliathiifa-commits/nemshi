import { MegaphoneIcon, SearchIcon, StoreIcon } from "@/components/icons";

export function HeroBanner() {
  return (
    <div className="relative min-h-[230px] overflow-hidden bg-brand-dark px-6 pb-16 pt-8 sm:min-h-[340px] sm:px-10 sm:pb-28 sm:pt-12">
      <div className="absolute inset-0 bg-[radial-gradient(rgba(0,91,79,0.16)_1.2px,transparent_1.2px)] bg-[length:22px_22px]" />

      <div className="relative z-10 max-w-xl">
        <p className="text-[11px] font-extrabold uppercase tracking-[0.28em] text-charcoal/65 sm:text-[13px]">
          Portal Masisir
        </p>
        <h2 className="mt-3 text-[clamp(2.4rem,7vw,5.8rem)] uppercase leading-[0.88] text-charcoal">
          Cari lebih cepat. Beres lebih dekat.
        </h2>
        <p className="mt-4 max-w-md text-[13px] font-semibold leading-6 text-charcoal/70 sm:text-base">
          Produk, jasa, dan bantuan komunitas dalam satu tempat yang rapi.
        </p>
      </div>

      <div className="absolute -bottom-24 right-8 hidden h-72 w-[420px] sm:block lg:right-16">
        {[
          { label: "Cari", icon: SearchIcon, className: "left-0 -rotate-6 bg-[#fffefa]" },
          { label: "Jual", icon: StoreIcon, className: "left-1/2 z-20 -translate-x-1/2 bg-brand" },
          { label: "Bantu", icon: MegaphoneIcon, className: "right-0 rotate-6 bg-[#fffefa]" },
        ].map((item) => (
          <div
            key={item.label}
            className={`absolute bottom-0 h-64 w-40 rounded-[26px] border-[2.5px] border-ink p-4 shadow-[6px_8px_0_0_#006451] ${item.className}`}
          >
            <div className="mx-auto h-3 w-16 rounded-full bg-charcoal" />
            <div className="mt-6 flex h-20 items-center justify-center rounded-[8px] bg-surface text-charcoal">
              <item.icon width={28} height={28} />
            </div>
            <p className="mt-4 text-center text-sm font-extrabold uppercase text-charcoal">
              {item.label}
            </p>
            <div className="mt-3 space-y-2">
              <div className="h-2 rounded-full bg-charcoal/15" />
              <div className="h-2 w-3/4 rounded-full bg-charcoal/10" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
