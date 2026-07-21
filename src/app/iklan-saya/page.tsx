import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUserId } from "@/lib/current-user";
import { getUserOffersServiceListings } from "@/lib/listings";
import { getUserActivitySummary } from "@/lib/users";
import { ListingStatusBadge } from "@/components/listing-status-badge";

export const dynamic = "force-dynamic";

export default async function IklanSayaPage() {
  const userId = await getCurrentUserId();
  if (!userId) {
    redirect("/masuk?redirectTo=/iklan-saya");
  }

  const [listingsList, activity] = await Promise.all([
    getUserOffersServiceListings(userId),
    getUserActivitySummary(userId),
  ]);

  const listingSlotQuota = activity.quotas.find((q) => q.quotaType === "Listing_Slot");

  return (
    <main className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
      <Link href="/" className="mb-6 inline-block text-sm font-medium text-primary hover:underline">
        ← Kembali ke Jelajahi Iklan Jasa
      </Link>

      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-text">Iklan Saya</h1>
        <div className="flex gap-2">
          <Link
            href="/analitik"
            className="rounded-xl border border-black/10 px-4 py-2 text-sm font-semibold text-text-secondary hover:bg-black/5"
          >
            Analitik Exposure
          </Link>
          <Link
            href="/pasang-iklan"
            className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white"
          >
            Pasang Iklan
          </Link>
        </div>
      </div>

      <section className="mb-6 rounded-xl border border-black/5 bg-white p-4">
        <p className="text-sm text-text-secondary">
          Sisa Kuota Tawarkan Jasa:{" "}
          <span className="font-semibold text-primary">
            {listingSlotQuota?.remainingAmount ?? 0}
          </span>
          {listingSlotQuota && (
            <span className="ml-1">
              (berlaku hingga {new Date(listingSlotQuota.validityEnd).toLocaleDateString("id-ID")})
            </span>
          )}
        </p>
      </section>

      {listingsList.length === 0 ? (
        <p className="text-text-secondary">Kamu belum pernah memasang iklan.</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {listingsList.map((listing) => (
            <li key={listing.id} className="rounded-xl border border-black/5 bg-white p-4">
              <div className="mb-1 flex items-center justify-between">
                <Link
                  href={`/iklan/${listing.id}`}
                  className="font-medium text-text hover:underline"
                >
                  {listing.title}
                </Link>
                <ListingStatusBadge status={listing.status} />
              </div>
              {listing.status === "Rejected" && listing.moderationReason && (
                <p className="text-sm text-red-600">Alasan: {listing.moderationReason}</p>
              )}
              {listing.expiresAt && listing.status === "Active" && (
                <p className="text-sm text-text-secondary">
                  Tayang sampai {new Date(listing.expiresAt).toLocaleString("id-ID")}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
