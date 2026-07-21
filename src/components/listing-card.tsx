import Image from "next/image";
import Link from "next/link";
import type { ListingSummary } from "@/lib/listings";
import { formatPriceLabel } from "@/lib/format";
import { VerificationBadge } from "@/components/verification-badge";

export function ListingCard({ listing }: { listing: ListingSummary }) {
  return (
    <Link
      href={`/iklan/${listing.id}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-black/5 bg-white transition-shadow hover:shadow-lg"
    >
      <div className="relative aspect-[4/3] w-full bg-[#f0f4f6]">
        {listing.coverPhotoUrl ? (
          <Image
            src={listing.coverPhotoUrl}
            alt={listing.title}
            fill
            className="object-cover transition-transform group-hover:scale-105"
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 100vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-text-secondary">
            Tidak ada foto
          </div>
        )}
        {listing.isPriority && (
          <span className="absolute left-2 top-2 rounded-full bg-primary px-2 py-0.5 text-xs font-semibold text-white">
            Prioritas
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1 p-4">
        <span className="text-xs font-medium text-text-secondary">
          {listing.category.name} · {listing.area.name}
        </span>
        <h3 className="line-clamp-2 font-semibold text-text">{listing.title}</h3>
        <p className="text-sm font-medium text-primary">
          {formatPriceLabel(listing.priceType, listing.priceMin, listing.priceMax)}
        </p>
        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="text-sm text-text-secondary">{listing.provider.fullName}</span>
          <VerificationBadge status={listing.provider.verificationStatus} />
        </div>
      </div>
    </Link>
  );
}
