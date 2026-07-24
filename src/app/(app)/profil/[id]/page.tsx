import { notFound } from "next/navigation";
import { Header } from "@/components/layout/header";
import { UserIcon } from "@/components/icons";
import { AdCard } from "@/components/ads/ad-card";
import { getSellerProfile } from "@/lib/mock-ads";

export default async function PublicProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const seller = getSellerProfile(decodeURIComponent(id));

  if (!seller) {
    notFound();
  }

  return (
    <>
      <Header title="Profil Pengiklan" />

      <main className="flex-1 px-6 py-8">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-card border border-border-subtle bg-white p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-black/20 text-ink">
                <UserIcon width={28} height={28} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-charcoal">{seller.name}</h2>
                <p className="mt-1 text-[14px] font-normal text-muted-foreground">
                  Bergabung sejak {seller.joinedYear} · {seller.activeAdsCount} iklan
                  aktif
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-xl font-bold text-charcoal">
              Iklan dari {seller.name}
            </h3>
            <p className="mt-1 text-[14px] font-normal text-muted-foreground">
              {seller.ads.length} iklan dipasang.
            </p>

            <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {seller.ads.map((ad) => (
                <AdCard key={ad.id} ad={ad} />
              ))}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
