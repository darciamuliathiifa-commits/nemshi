import { Suspense } from "react";
import { getActiveListings, getAreas, getCategories } from "@/lib/listings";
import { getCurrentUserId } from "@/lib/current-user";
import { getSavedListingIds } from "@/lib/saved-listings";
import { SayembaraBoard } from "./sayembara-board";

// Data berubah tiap ada sayembara baru/kedaluwarsa — jangan biarkan Next.js
// static-optimize halaman ini jadi satu snapshot beku saat build.
export const dynamic = "force-dynamic";

export default async function SayembaraPage() {
  const userId = await getCurrentUserId();

  const [listings, categories, areas, savedListingIds] = await Promise.all([
    getActiveListings({ type: "Needs_Service" }),
    getCategories(),
    getAreas(),
    userId ? getSavedListingIds(userId) : Promise.resolve([]),
  ]);

  return (
    <Suspense>
      <SayembaraBoard
        initialListings={listings}
        initialCategories={categories}
        initialAreas={areas}
        savedListingIds={savedListingIds}
      />
    </Suspense>
  );
}
