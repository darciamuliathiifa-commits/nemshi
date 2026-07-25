import { ShieldCheckIcon } from "@/components/icons";

export function TransactionDisclaimer() {
  return (
    <div className="mt-8 flex items-start gap-3 rounded-card border border-border-subtle bg-surface/40 p-5">
      <ShieldCheckIcon
        width={20}
        height={20}
        className="mt-0.5 shrink-0 text-muted-foreground"
      />
      <div>
        <p className="text-[13px] font-bold text-charcoal">
          Perhatian Sebelum Bertransaksi
        </p>
        <p className="mt-1 text-[12px] font-normal leading-5 text-muted-foreground">
          Nemshi hanya menyediakan platform direktori untuk mempertemukan
          pengguna — kami tidak terlibat dan tidak bertanggung jawab atas
          transaksi, kesepakatan, atau kelalaian dari pihak mana pun. Pastikan
          kamu berhati-hati, verifikasi identitas, dan sepakati detail
          transaksi langsung dengan pihak terkait sebelum melakukan
          pembayaran atau serah terima.
        </p>
      </div>
    </div>
  );
}
