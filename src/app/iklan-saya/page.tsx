import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUserId } from "@/lib/current-user";
import { getOwnListingCards } from "@/lib/listings";
import { getUserActivitySummary } from "@/lib/users";
import { ListingCard } from "@/components/listing-card";

export const dynamic = "force-dynamic";

export default async function IklanSayaPage() {
  const userId = await getCurrentUserId();
  if (!userId) {
    redirect("/masuk?redirectTo=/iklan-saya");
  }

  const [listingsList, activity] = await Promise.all([
    getOwnListingCards(userId, "Offers_Service"),
    getUserActivitySummary(userId),
  ]);

  const listingSlotQuota = activity.quotas.find((q) => q.quotaType === "Listing_Slot");

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
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
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {listingsList.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      )}
    </main>
  );
}
