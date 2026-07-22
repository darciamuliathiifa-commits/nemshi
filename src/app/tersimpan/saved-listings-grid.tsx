"use client";

import { useState } from "react";
import { ListingCard } from "@/components/listing-card";
import { SaveButton } from "@/components/save-button";
import type { ListingSummary } from "@/lib/listings";

export function SavedListingsGrid({ initialListings }: { initialListings: ListingSummary[] }) {
  const [listings, setListings] = useState(initialListings);

  function handleUnsave(listingId: string) {
    setListings((prev) => prev.filter((l) => l.id !== listingId));
  }

  if (listings.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-black/10 bg-surface/50 py-16 text-center text-text-secondary">
        Belum ada jasa yang kamu simpan.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {listings.map((listing) => (
        <div key={listing.id} className="relative">
          <ListingCard listing={listing} />
          <div className="absolute right-2 top-2">
            <SaveButtonWrapper listingId={listing.id} onUnsave={() => handleUnsave(listing.id)} />
          </div>
        </div>
      ))}
    </div>
  );
}

function SaveButtonWrapper({
  listingId,
  onUnsave,
}: {
  listingId: string;
  onUnsave: () => void;
}) {
  return (
    <SaveButton
      listingId={listingId}
      initialSaved={true}
      onChange={(saved) => {
        if (!saved) onUnsave();
      }}
    />
  );
}
