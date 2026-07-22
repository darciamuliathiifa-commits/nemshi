import Image from "next/image";
import Link from "next/link";
import type { ListingSummary, OwnListingCard } from "@/lib/listings";
import { formatPriceLabel, formatRemainingLabel } from "@/lib/format";
import { VerificationBadge } from "@/components/verification-badge";
import { ListingStatusBadge } from "@/components/listing-status-badge";
import { SaveButton } from "@/components/save-button";

export function ListingCard({
  listing,
  isSaved,
}: {
  listing: ListingSummary | OwnListingCard;
  /** Hanya tampilkan tombol simpan jika prop ini diisi (mis. bukan di grid "Iklan Saya"). */
  isSaved?: boolean;
}) {
  const own = "status" in listing ? (listing as OwnListingCard) : null;
  const isExpired = own?.isExpired ?? false;
  const isClickable = (!own || own.status === "Active") && !isExpired;

  const body = (
    <div
      className={`group flex h-full flex-col overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm transition-all duration-200 ${
        isClickable ? "hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/10" : ""
      } ${isExpired ? "opacity-60" : ""}`}
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-surface">
        {listing.coverPhotoUrl ? (
          <Image
            src={listing.coverPhotoUrl}
            alt={listing.title}
            fill
            className={`object-cover ${isClickable ? "transition-transform duration-300 group-hover:scale-105" : ""}`}
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 100vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-text-secondary">
            Tidak ada foto
          </div>
        )}
        {isExpired ? (
          <span className="absolute left-2 top-2 rounded-full bg-black/60 px-2 py-0.5 text-xs font-semibold text-white shadow-sm backdrop-blur-sm">
            Sudah Berakhir
          </span>
        ) : (
          listing.isPriority && (
            <span className="absolute left-2 top-2 rounded-full bg-primary px-2 py-0.5 text-xs font-semibold text-white shadow-sm">
              Prioritas
            </span>
          )
        )}
        {isSaved !== undefined && <SaveButton listingId={listing.id} initialSaved={isSaved} />}
      </div>
      <div className="flex flex-1 flex-col gap-1.5 p-4">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-medium text-text-secondary">
            {listing.category.name} · {listing.area.name}
          </span>
          {own && !isExpired && <ListingStatusBadge status={own.status} />}
        </div>
        <h3 className="line-clamp-2 font-semibold text-text">{listing.title}</h3>
        <p
          className={
            listing.priceType === "Contact"
              ? "text-sm text-text-secondary"
              : "text-sm font-semibold text-primary"
          }
        >
          {formatPriceLabel(listing.priceType, listing.priceMin, listing.priceMax)}
        </p>
        {own?.status === "Rejected" && own.moderationReason && (
          <p className="text-xs text-red-600">Alasan: {own.moderationReason}</p>
        )}
        {own?.status === "Active" && own.expiresAt && (
          <p className="text-xs text-text-secondary">
            {own.isPriority ? "Prioritas · " : ""}
            {formatRemainingLabel(own.expiresAt)}
          </p>
        )}
        <div className="mt-auto flex items-center justify-between gap-2 pt-3">
          <div className="flex min-w-0 items-center gap-2">
            <div className="relative h-6 w-6 shrink-0 overflow-hidden rounded-full border border-black/5 bg-surface">
              {listing.provider.avatarUrl && (
                <Image
                  src={listing.provider.avatarUrl}
                  alt={listing.provider.fullName}
                  fill
                  className="object-cover"
                  sizes="24px"
                />
              )}
            </div>
            <span className="truncate text-sm text-text-secondary">
              {listing.provider.fullName}
            </span>
          </div>
          <VerificationBadge status={listing.provider.verificationStatus} />
        </div>
      </div>
    </div>
  );

  if (!isClickable) {
    return body;
  }

  return (
    <Link href={`/iklan/${listing.id}`} className="block h-full">
      {body}
    </Link>
  );
}
