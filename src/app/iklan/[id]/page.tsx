import Link from "next/link";
import { notFound } from "next/navigation";
import { getListingById } from "@/lib/listings";
import { ListingDetailClient } from "./listing-detail-client";

export default async function IklanDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const listing = await getListingById(id);

  if (!listing) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <Link href="/" className="mb-6 inline-block text-sm font-medium text-primary hover:underline">
        ← Kembali ke Jelajahi Iklan Jasa
      </Link>
      <ListingDetailClient listing={listing} />
    </main>
  );
}
