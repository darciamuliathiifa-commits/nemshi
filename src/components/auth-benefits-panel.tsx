import { PRODUCT_PRICES } from "@/lib/pricing";
import { formatRupiah } from "@/lib/format";

const FREE_BENEFITS = [
  "Jelajahi & cari ratusan iklan jasa sesama Masisir",
  "Hubungi penyedia jasa langsung via WhatsApp — tanpa perantara",
  "Pasang 1 permintaan Cari Jasa tiap 30 hari, gratis",
];

const PAID_BENEFITS = [
  {
    title: "Tawarkan Jasa",
    price: `${formatRupiah(PRODUCT_PRICES.Iklan_Tawarkan_Jasa)} / iklan`,
    desc: "Iklan jasamu tayang 30 hari di direktori.",
  },
  {
    title: "Cari Jasa Prioritas",
    price: formatRupiah(PRODUCT_PRICES.Cari_Jasa_Prioritas),
    desc: "Permintaanmu tampil paling atas selama 3 hari.",
  },
  {
    title: "Paket Plus",
    price: formatRupiah(PRODUCT_PRICES.Paket_Plus),
    desc: "3 Tawarkan Jasa + 2 Cari Jasa Prioritas — paling hemat.",
  },
];

function CheckIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="mt-0.5 h-4 w-4 shrink-0 text-white">
      <path
        d="M4 10.5L8 14.5L16 6.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function AuthBenefitsPanel({ className = "" }: { className?: string }) {
  return (
    <aside
      className={`flex flex-col justify-center gap-8 bg-text px-6 py-12 text-white sm:px-10 lg:px-14 ${className}`}
    >
      <div>
        <h2 className="font-display text-2xl font-bold leading-tight sm:text-3xl">
          Tawarkan jasa. Cari jasa. <span className="text-accent-dark">Semua di Nemshi.</span>
        </h2>
        <p className="mt-3 max-w-md text-sm text-white/60">
          Setelah masuk, kamu bisa memasang iklan jasamu atau membuat permintaan jasa — lalu
          terhubung langsung via WhatsApp tanpa perantara.
        </p>
      </div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-white/50">
          Gratis, selamanya
        </p>
        <ul className="mt-3 flex flex-col gap-2.5">
          {FREE_BENEFITS.map((benefit) => (
            <li key={benefit} className="flex items-start gap-2.5 text-sm text-white/90">
              <CheckIcon />
              {benefit}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-white/50">
          Upgrade berbayar
        </p>
        <div className="mt-3 flex flex-col gap-3">
          {PAID_BENEFITS.map((item) => (
            <div
              key={item.title}
              className="flex items-baseline justify-between gap-4 border-b border-white/10 pb-3 last:border-0 last:pb-0"
            >
              <div>
                <p className="text-sm font-semibold">{item.title}</p>
                <p className="text-xs text-white/60">{item.desc}</p>
              </div>
              <span className="shrink-0 text-sm font-semibold text-accent-dark">{item.price}</span>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
