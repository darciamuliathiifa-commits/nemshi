import { getActiveListings, getAreas, getCategories } from "@/lib/listings";
import { getFeaturedTestimonials } from "@/lib/users";
import { getCurrentUserId } from "@/lib/current-user";
import { getSavedListingIds } from "@/lib/saved-listings";
import { LandingPage } from "./landing-page";

// Data berubah tiap saat (iklan baru, kedaluwarsa, dll) — jangan biarkan
// Next.js static-optimize halaman ini jadi satu snapshot beku saat build.
export const dynamic = "force-dynamic";

export default async function Home() {
  const userId = await getCurrentUserId();

  const [listings, categories, areas, testimonials, savedListingIds] = await Promise.all([
    getActiveListings({ type: "Offers_Service" }),
    getCategories(),
    getAreas(),
    getFeaturedTestimonials(6),
    userId ? getSavedListingIds(userId) : Promise.resolve([]),
  ]);

  return (
    <LandingPage
      featuredListings={listings.slice(0, 10)}
      listingCount={listings.length}
      categoryCount={categories.length}
      areaCount={areas.length}
      testimonials={testimonials}
      savedListingIds={savedListingIds}
    />
  );
}
