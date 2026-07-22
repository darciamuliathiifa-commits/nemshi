import Link from "next/link";
import { requireActiveUser } from "@/lib/current-user";
import { getSavedListings } from "@/lib/saved-listings";
import { SavedListingsGrid } from "./saved-listings-grid";

export const dynamic = "force-dynamic";

export default async function TersimpanPage() {
  const userId = await requireActiveUser("/tersimpan");
  const listings = await getSavedListings(userId);

  return (
    <div className="bg-surface-tint">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-text-secondary hover:text-primary"
        >
          ← Kembali ke Jelajahi Iklan Jasa
        </Link>

        <section className="rounded-3xl bg-white p-6 shadow-sm shadow-black/5 sm:p-8">
          <h1 className="font-display text-2xl font-semibold text-text">Jasa Tersimpan</h1>
          <p className="mt-2 mb-6 text-text-secondary">
            Iklan yang kamu tandai untuk dihubungi lagi nanti.
          </p>

          <SavedListingsGrid initialListings={listings} />
        </section>
      </div>
    </div>
  );
}
