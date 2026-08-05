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

      <div className="absolute right-10 top-1/2 hidden -translate-y-1/2 items-center gap-3 xl:flex">
        {[
          { label: "Cari", icon: SearchIcon, className: "bg-[#fffefa]" },
          { label: "Jual", icon: StoreIcon, className: "bg-brand" },
          { label: "Bantu", icon: MegaphoneIcon, className: "bg-[#fffefa]" },
        ].map((item) => (
          <div
            key={item.label}
            className={`flex h-24 w-24 flex-col items-center justify-center rounded-[8px] border-[2.5px] border-ink shadow-[4px_4px_0_0_#006451] ${item.className}`}
          >
            <item.icon width={24} height={24} />
            <p className="mt-2 text-center text-[11px] font-extrabold uppercase text-charcoal">
              {item.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
