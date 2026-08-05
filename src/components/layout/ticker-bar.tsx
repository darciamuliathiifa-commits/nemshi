const defaultItems = [
  "Slot iklan pertama gratis",
  "Balas cepat lewat WhatsApp",
  "Sayembara jasa tiap minggu",
];

export function TickerBar({ items = defaultItems }: { items?: string[] }) {
  const looped = [...items, ...items];

  return (
    <div className="overflow-hidden whitespace-nowrap border-b border-ink/15 bg-brand-dark py-2 text-[12px] font-bold text-charcoal">
      <div className="inline-block animate-[marquee_22s_linear_infinite]">
        {looped.map((item, index) => (
          <span key={index} className="mx-4 inline-flex items-center gap-4">
            {item}
            <span aria-hidden>•</span>
          </span>
        ))}
      </div>
    </div>
  );
}
