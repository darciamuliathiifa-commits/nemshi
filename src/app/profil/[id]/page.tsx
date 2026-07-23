import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { VerificationBadge } from "@/components/verification-badge";
import { getPublicProfile, getUserActiveListings, getUserTestimonials } from "@/lib/users";
import { TestimonialsSection } from "./testimonials-section";

export const dynamic = "force-dynamic";

export default async function PublicProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const profile = await getPublicProfile(id);

  if (!profile) {
    notFound();
  }

  const [{ offers, requests }, testimonials] = await Promise.all([
    getUserActiveListings(id),
    getUserTestimonials(id),
  ]);

  return (
    <div className="bg-surface-tint">
      <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6 lg:px-8">
        <Link
          href="/jelajahi"
          className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-text-secondary hover:text-primary"
        >
          ← Kembali ke Jelajahi Iklan Jasa
        </Link>

        <section className="bg-white p-6 border border-black/10 sm:p-8">
          <div className="flex items-center gap-4">
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full bg-surface">
              {profile.avatarUrl ? (
                <Image src={profile.avatarUrl} alt={profile.fullName} fill className="object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center text-2xl font-semibold text-text-secondary">
                  {profile.fullName.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div className="flex flex-col gap-1">
              <h1 className="font-display text-2xl font-semibold text-text">
                {profile.fullName}
              </h1>
              <VerificationBadge status={profile.verificationStatus} />
            </div>
            {profile.whatsappLink && (
              <a
                href={profile.whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-auto shrink-0 bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-transform hover:scale-[1.02]"
              >
                Hubungi via WhatsApp
              </a>
            )}
          </div>

          {offers.length > 0 && (
            <div className="mt-6 border-t border-black/5 pt-6">
              <h2 className="mb-3 font-display text-lg font-semibold text-text">Jasa Aktif</h2>
              <ul className="flex flex-col gap-2">
                {offers.map((listing) => (
                  <li key={listing.id}>
                    <Link
                      href={`/iklan/${listing.id}`}
                      className="block bg-surface p-4 transition-colors hover:bg-surface-tint"
                    >
                      {listing.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {requests.length > 0 && (
            <div className="mt-6 border-t border-black/5 pt-6">
              <h2 className="mb-3 font-display text-lg font-semibold text-text">
                Permintaan Jasa
              </h2>
              <ul className="flex flex-col gap-2">
                {requests.map((listing) => (
                  <li key={listing.id}>
                    <Link
                      href={`/iklan/${listing.id}`}
                      className="block bg-surface p-4 transition-colors hover:bg-surface-tint"
                    >
                      {listing.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-6 border-t border-black/5 pt-6">
            <TestimonialsSection userId={id} initialData={testimonials} />
          </div>
        </section>
      </div>
    </div>
  );
}
