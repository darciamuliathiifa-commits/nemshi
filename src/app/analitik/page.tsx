"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { formatRelativeTime } from "@/lib/format";

type ListingAnalytics = {
  id: string;
  title: string;
  impressions: number;
  clicks: number;
  lastClickAt: string | null;
};

export default function AnalitikExposurePage() {
  const router = useRouter();
  const [analytics, setAnalytics] = useState<ListingAnalytics[] | null>(null);

  useEffect(() => {
    fetch("/api/listings/me/analytics").then(async (response) => {
      if (response.status === 401) {
        router.replace("/masuk?redirectTo=/analitik");
        return;
      }
      setAnalytics(await response.json());
    });
  }, [router]);

  return (
    <main className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
      <Link href="/iklan-saya" className="mb-6 inline-block text-sm font-medium text-primary hover:underline">
        ← Kembali ke Iklan Saya
      </Link>

      <h1 className="mb-2 text-2xl font-bold text-text">Analitik Exposure</h1>
      <p className="mb-6 text-sm text-text-secondary">
        Bukti nyata seberapa banyak orang melihat iklanmu dan menghubungimu lewat WhatsApp.
      </p>

      {!analytics ? (
        <p className="text-text-secondary">Memuat analitik...</p>
      ) : analytics.length === 0 ? (
        <p className="text-text-secondary">
          Belum ada iklan aktif.{" "}
          <Link href="/pasang-iklan" className="font-medium text-primary hover:underline">
            Pasang iklan sekarang →
          </Link>
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          {analytics.map((item) => (
            <li key={item.id} className="rounded-xl border border-black/5 bg-white p-4">
              <Link
                href={`/iklan/${item.id}`}
                className="mb-3 block font-medium text-text hover:underline"
              >
                {item.title}
              </Link>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div>
                  <p className="text-xl font-bold text-primary">{item.impressions}</p>
                  <p className="text-xs text-text-secondary">Tayangan</p>
                </div>
                <div>
                  <p className="text-xl font-bold text-primary">{item.clicks}</p>
                  <p className="text-xs text-text-secondary">Klik WhatsApp</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-text">
                    {item.lastClickAt ? formatRelativeTime(item.lastClickAt) : "Belum ada"}
                  </p>
                  <p className="text-xs text-text-secondary">Klik Terakhir</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
