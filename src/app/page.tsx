import { Suspense } from "react";
import { getActiveListings, getAreas, getCategories } from "@/lib/listings";
import { getFeaturedTestimonials } from "@/lib/users";
import { JelajahiGallery } from "./jelajahi-gallery";

// Data berubah tiap kali ada iklan baru/kedaluwarsa — jangan biarkan Next.js
// static-optimize halaman ini jadi satu snapshot beku saat build.
export const dynamic = "force-dynamic";

export default async function Home() {
  const [listings, categories, areas, testimonials] = await Promise.all([
    getActiveListings({ type: "Offers_Service" }),
    getCategories(),
    getAreas(),
    getFeaturedTestimonials(6),
  ]);

  return (
    <Suspense>
      <JelajahiGallery
        initialListings={listings}
        initialCategories={categories}
        initialAreas={areas}
        initialTestimonials={testimonials}
      />
    </Suspense>
  );
}
