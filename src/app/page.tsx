import { countActiveListings, getAreas, getCategories } from "@/lib/listings";
import { getFeaturedTestimonials } from "@/lib/users";
import { LandingPage } from "./landing-page";

// Statistik (jumlah iklan aktif dkk) berubah tiap saat — jangan biarkan
// Next.js static-optimize halaman ini jadi satu snapshot beku saat build.
export const dynamic = "force-dynamic";

export default async function Home() {
  const [listingCount, categories, areas, testimonials] = await Promise.all([
    countActiveListings("Offers_Service"),
    getCategories(),
    getAreas(),
    getFeaturedTestimonials(6),
  ]);

  return (
    <LandingPage
      listingCount={listingCount}
      categoryCount={categories.length}
      areaCount={areas.length}
      testimonials={testimonials}
    />
  );
}
