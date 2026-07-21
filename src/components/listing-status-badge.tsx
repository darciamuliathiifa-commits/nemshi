const STATUS_STYLES: Record<string, string> = {
  Active: "bg-green-100 text-green-700",
  Pending_Moderation: "bg-amber-100 text-amber-700",
  Expired: "bg-black/10 text-text-secondary",
  Rejected: "bg-red-100 text-red-700",
};

const STATUS_LABELS: Record<string, string> = {
  Active: "Aktif",
  Pending_Moderation: "Menunggu Moderasi",
  Expired: "Kedaluwarsa",
  Rejected: "Ditolak",
};

export function ListingStatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
        STATUS_STYLES[status] ?? "bg-black/10 text-text-secondary"
      }`}
    >
      {STATUS_LABELS[status] ?? status}
    </span>
  );
}
