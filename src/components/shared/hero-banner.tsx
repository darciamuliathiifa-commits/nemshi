import { MegaphoneIcon, SearchIcon, StoreIcon } from "@/components/icons";

export function HeroBanner() {
  return (
    <div className="relative min-h-[220px] overflow-hidden bg-brand-dark px-6 pb-14 pt-7 sm:min-h-[280px] sm:px-8 sm:pb-20 sm:pt-9 lg:min-h-[300px] lg:px-10">
      <div className="absolute inset-0 bg-[radial-gradient(rgba(0,91,79,0.16)_1.2px,transparent_1.2px)] bg-[length:22px_22px]" />

      <div className="relative z-10 max-w-md lg:max-w-2xl">
        <p className="text-[10px] font-extrabold uppercase tracking-[0.24em] text-charcoal/65 sm:text-xs">
          Portal Masisir
        </p>
        <h2 className="mt-2 text-[clamp(2.1rem,5vw,4rem)] uppercase leading-[0.9] text-charcoal">
          Cari lebih cepat. Beres lebih dekat.
        </h2>
        <p className="mt-3 max-w-sm text-xs font-semibold leading-5 text-charcoal/70 sm:text-sm">
          Produk, jasa, dan bantuan komunitas dalam satu tempat yang rapi.
        </p>
      </div>

      <div className="absolute -bottom-14 right-6 hidden h-52 w-[320px] lg:block lg:right-10">
        {[
          { label: "Cari", icon: SearchIcon, className: "left-0 -rotate-6 bg-[#fffefa]" },
          { label: "Jual", icon: StoreIcon, className: "left-1/2 z-20 -translate-x-1/2 bg-brand" },
          { label: "Bantu", icon: MegaphoneIcon, className: "right-0 rotate-6 bg-[#fffefa]" },
        ].map((item) => (
          <div
            key={item.label}
            className={`absolute bottom-0 h-48 w-28 rounded-[18px] border-[2.5px] border-ink p-3 shadow-[5px_6px_0_0_#006451] ${item.className}`}
          >
            <div className="mx-auto h-2.5 w-12 rounded-full bg-charcoal" />
            <div className="mt-4 flex h-14 items-center justify-center rounded-[7px] bg-surface text-charcoal">
              <item.icon width={22} height={22} />
            </div>
            <p className="mt-3 text-center text-xs font-extrabold uppercase text-charcoal">
              {item.label}
            </p>
            <div className="mt-2.5 space-y-1.5">
              <div className="h-1.5 rounded-full bg-charcoal/15" />
              <div className="h-1.5 w-3/4 rounded-full bg-charcoal/10" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
