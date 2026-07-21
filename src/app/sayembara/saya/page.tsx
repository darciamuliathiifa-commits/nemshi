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
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <Link href="/sayembara" className="mb-6 inline-block text-sm font-medium text-primary hover:underline">
        ← Kembali ke Cari Jasa
      </Link>

      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-text">Sayembara Saya</h1>
        <Link
          href="/sayembara/buat"
          className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white"
        >
          Buat Sayembara
        </Link>
      </div>

      <section className="mb-6 rounded-xl border border-black/5 bg-white p-4">
        <p className="text-sm text-text-secondary">
          Sisa Kuota Cari Jasa Prioritas:{" "}
          <span className="font-semibold text-primary">
            {prioritySlotQuota?.remainingAmount ?? 0}
          </span>
          {prioritySlotQuota && (
            <span className="ml-1">
              (berlaku hingga {new Date(prioritySlotQuota.validityEnd).toLocaleDateString("id-ID")})
            </span>
          )}
        </p>
      </section>

      {listingsList.length === 0 ? (
        <p className="text-text-secondary">Kamu belum pernah membuat sayembara.</p>
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
