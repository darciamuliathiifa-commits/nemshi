import Link from "next/link";
import { notFound } from "next/navigation";
import { getListingById } from "@/lib/listings";
import { getCurrentUserId } from "@/lib/current-user";
import { isListingSaved } from "@/lib/saved-listings";
import { ListingDetailClient } from "./listing-detail-client";

export default async function IklanDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const listing = await getListingById(id);

  if (!listing) {
    notFound();
  }

  const userId = await getCurrentUserId();
  const isSaved = userId ? await isListingSaved(userId, id) : false;

  return (
    <div className="bg-surface-tint">
      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
        <Link
          href="/jelajahi"
          className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-text-secondary hover:text-primary"
        >
          ← Kembali ke Jelajahi Iklan Jasa
        </Link>
        <ListingDetailClient listing={listing} isSaved={isSaved} />
      </div>
    </div>
  );
}
