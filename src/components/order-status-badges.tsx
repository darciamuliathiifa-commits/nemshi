const PAYMENT_STATUS_STYLES: Record<string, string> = {
  Menunggu_Pembayaran: "bg-amber-100 text-amber-700",
  Sukses: "bg-green-100 text-green-700",
  Gagal: "bg-red-100 text-red-700",
};

const PAYMENT_STATUS_LABELS: Record<string, string> = {
  Menunggu_Pembayaran: "Menunggu Pembayaran",
  Sukses: "Pembayaran Sukses",
  Gagal: "Pembayaran Gagal",
};

export function PaymentStatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`rounded px-2 py-0.5 text-xs font-medium ${
        PAYMENT_STATUS_STYLES[status] ?? "bg-black/10 text-text-secondary"
      }`}
    >
      {PAYMENT_STATUS_LABELS[status] ?? status}
    </span>
  );
}

const FUND_STATUS_STYLES: Record<string, string> = {
  Ditahan: "bg-amber-100 text-amber-700",
  Dirilis: "bg-green-100 text-green-700",
  Dikembalikan: "bg-blue-100 text-blue-700",
};

const FUND_STATUS_LABELS: Record<string, string> = {
  Ditahan: "Dana Ditahan",
  Dirilis: "Dana Dirilis",
  Dikembalikan: "Dana Dikembalikan",
};

export function FundStatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`rounded px-2 py-0.5 text-xs font-medium ${
        FUND_STATUS_STYLES[status] ?? "bg-black/10 text-text-secondary"
      }`}
    >
      {FUND_STATUS_LABELS[status] ?? status}
    </span>
  );
}
