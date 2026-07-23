import Link from "next/link";
import { requireActiveUser } from "@/lib/current-user";
import { getOwnListingCards } from "@/lib/listings";
import { getUserActivitySummary } from "@/lib/users";
import { ListingCard } from "@/components/listing-card";

export const dynamic = "force-dynamic";

export default async function SayembaraSayaPage() {
  const userId = await requireActiveUser("/sayembara/saya");

  const [listingsList, activity] = await Promise.all([
    getOwnListingCards(userId, "Needs_Service"),
    getUserActivitySummary(userId),
  ]);

  const prioritySlotQuota = activity.quotas.find((q) => q.quotaType === "Priority_Slot");

  return (
    <div className="bg-surface-tint">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        <Link
          href="/sayembara"
          className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-text-secondary hover:text-primary"
        >
          ← Kembali ke Cari Jasa
        </Link>

        <section className="bg-white p-6 border border-black/10 sm:p-8">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <h1 className="font-display text-2xl font-semibold text-text">Sayembara Saya</h1>
            <Link
              href="/sayembara/buat"
              className="bg-primary px-4 py-2 text-sm font-semibold text-white transition-transform hover:scale-[1.02]"
            >
              Buat Sayembara
            </Link>
          </div>

          <div className="mb-6 bg-surface p-4">
            <p className="text-sm text-text-secondary">
              Sisa Kuota Cari Jasa Prioritas:{" "}
              <span className="font-semibold text-primary">
                {prioritySlotQuota?.remainingAmount ?? 0}
              </span>
              {prioritySlotQuota && (
                <span className="ml-1">
                  (berlaku hingga{" "}
                  {new Date(prioritySlotQuota.validityEnd).toLocaleDateString("id-ID")})
                </span>
              )}
            </p>
          </div>

          {listingsList.length === 0 ? (
            <p className="text-text-secondary">Kamu belum pernah membuat sayembara.</p>
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
