import { Header } from "@/components/layout/header";
import { MyAdsList } from "@/components/ads/my-ads-list";
import { mockMyAds } from "@/lib/mock-my-ads";

export default function IklanSayaPage() {
  return (
    <>
      <Header title="Iklan Saya" />

      <main className="flex-1 px-6 py-8">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-charcoal">Kelola Iklan Saya</h2>
          <p className="mt-1 text-[14px] font-normal text-muted-foreground">
            Pantau status semua iklan yang pernah kamu pasang.
          </p>
        </div>

        <MyAdsList ads={mockMyAds} />
      </main>
    </>
  );
}
