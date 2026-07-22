import { Suspense } from "react";
import { getActiveListings, getAreas, getCategories } from "@/lib/listings";
import { getCurrentUserId } from "@/lib/current-user";
import { getSavedListingIds } from "@/lib/saved-listings";
import { JelajahiCatalog } from "./jelajahi-catalog";

// Data berubah tiap kali ada iklan baru/kedaluwarsa — jangan biarkan Next.js
// static-optimize halaman ini jadi satu snapshot beku saat build.
export const dynamic = "force-dynamic";

export default async function JelajahiPage() {
  const userId = await getCurrentUserId();

  const [listings, categories, areas, savedListingIds] = await Promise.all([
    getActiveListings({ type: "Offers_Service" }),
    getCategories(),
    getAreas(),
    userId ? getSavedListingIds(userId) : Promise.resolve([]),
  ]);

  return (
    <Suspense>
      <JelajahiCatalog
        initialListings={listings}
        initialCategories={categories}
        initialAreas={areas}
        savedListingIds={savedListingIds}
      />
    </Suspense>
  );
}
