import Link from "next/link";
import { requireActiveUser } from "@/lib/current-user";
import { getOwnListingCards } from "@/lib/listings";
import { getUserActivitySummary } from "@/lib/users";
import { ListingCard } from "@/components/listing-card";

export const dynamic = "force-dynamic";

export default async function IklanSayaPage() {
  const userId = await requireActiveUser("/iklan-saya");

  const [listingsList, activity] = await Promise.all([
    getOwnListingCards(userId, "Offers_Service"),
    getUserActivitySummary(userId),
  ]);

  const listingSlotQuota = activity.quotas.find((q) => q.quotaType === "Listing_Slot");

  return (
    <div className="bg-surface-tint">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        <Link
          href="/jelajahi"
          className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-text-secondary hover:text-primary"
        >
          ← Kembali ke Jelajahi Iklan Jasa
        </Link>

        <section className="rounded-3xl bg-white p-6 shadow-sm shadow-black/5 sm:p-8">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <h1 className="font-display text-2xl font-semibold text-text">Iklan Saya</h1>
            <div className="flex gap-2">
              <Link
                href="/analitik"
                className="rounded-full border border-black/10 px-4 py-2 text-sm font-semibold text-text-secondary hover:bg-surface"
              >
                Analitik Exposure
              </Link>
              <Link
                href="/pasang-iklan"
                className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition-transform hover:scale-[1.02]"
              >
                Pasang Iklan
              </Link>
            </div>
          </div>

          <div className="mb-6 rounded-2xl bg-surface p-4">
            <p className="text-sm text-text-secondary">
              Sisa Kuota Tawarkan Jasa:{" "}
              <span className="font-semibold text-primary">
                {listingSlotQuota?.remainingAmount ?? 0}
              </span>
              {listingSlotQuota && (
                <span className="ml-1">
                  (berlaku hingga{" "}
                  {new Date(listingSlotQuota.validityEnd).toLocaleDateString("id-ID")})
                </span>
              )}
            </p>
          </div>

          {listingsList.length === 0 ? (
            <p className="text-text-secondary">Kamu belum pernah memasang iklan.</p>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {listingsList.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
