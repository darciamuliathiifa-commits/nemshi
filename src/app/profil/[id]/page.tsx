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
    <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <Link href="/" className="mb-6 inline-block text-sm font-medium text-primary hover:underline">
        ← Kembali ke Jelajahi Iklan Jasa
      </Link>

      <section className="flex items-center gap-4 rounded-xl border border-black/5 bg-white p-6">
        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full bg-[#f0f4f6]">
          {profile.avatarUrl ? (
            <Image src={profile.avatarUrl} alt={profile.fullName} fill className="object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center text-2xl font-semibold text-text-secondary">
              {profile.fullName.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <div className="flex flex-col gap-1">
          <h1 className="text-xl font-bold text-text">{profile.fullName}</h1>
          <VerificationBadge status={profile.verificationStatus} />
        </div>
        {profile.whatsappLink && (
          <a
            href={profile.whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-auto rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white"
          >
            Hubungi via WhatsApp
          </a>
        )}
      </section>

      {offers.length > 0 && (
        <section className="mt-6">
          <h2 className="mb-3 font-semibold text-text">Jasa Aktif</h2>
          <ul className="flex flex-col gap-2">
            {offers.map((listing) => (
              <li key={listing.id}>
                <Link
                  href={`/iklan/${listing.id}`}
                  className="block rounded-xl border border-black/5 bg-white p-4 hover:shadow"
                >
                  {listing.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {requests.length > 0 && (
        <section className="mt-6">
          <h2 className="mb-3 font-semibold text-text">Permintaan Jasa</h2>
          <ul className="flex flex-col gap-2">
            {requests.map((listing) => (
              <li key={listing.id}>
                <Link
                  href={`/iklan/${listing.id}`}
                  className="block rounded-xl border border-black/5 bg-white p-4 hover:shadow"
                >
                  {listing.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <TestimonialsSection userId={id} initialData={testimonials} />
    </main>
  );
}
