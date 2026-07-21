import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUserId } from "@/lib/current-user";
import { getUserNeedsServiceListings } from "@/lib/listings";
import { getUserActivitySummary } from "@/lib/users";
import { ListingStatusBadge } from "@/components/listing-status-badge";

export const dynamic = "force-dynamic";

export default async function SayembaraSayaPage() {
  const userId = await getCurrentUserId();
  if (!userId) {
    redirect("/masuk?redirectTo=/sayembara/saya");
  }

  const [listingsList, activity] = await Promise.all([
    getUserNeedsServiceListings(userId),
    getUserActivitySummary(userId),
  ]);

  const prioritySlotQuota = activity.quotas.find((q) => q.quotaType === "Priority_Slot");

  return (
    <main className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
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
              <p className="text-sm text-text-secondary">
                {listing.isPriority ? "Prioritas (3 hari)" : "Gratis (24 jam)"}
                {listing.expiresAt &&
                  ` · Berakhir ${new Date(listing.expiresAt).toLocaleString("id-ID")}`}
              </p>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
