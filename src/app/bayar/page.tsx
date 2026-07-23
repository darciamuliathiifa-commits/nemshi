"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { PRODUCT_LABELS, PRODUCT_PRICES, type OrderProductType } from "@/lib/pricing";
import { formatRupiah } from "@/lib/format";

type PlanCard = {
  productType: OrderProductType;
  subtitle: string;
  badge?: string;
  priceSuffix: string;
  features: string[];
  cta: string;
  featured?: boolean;
};

const PLAN_CARDS: PlanCard[] = [
  {
    productType: "Iklan_Tawarkan_Jasa",
    subtitle: "Untuk sekali pasang iklan",
    priceSuffix: "sekali bayar",
    features: [
      "Tayang 30 hari setelah lolos moderasi",
      "Tampil di halaman Jelajahi Jasa",
      "Hingga 5 foto portofolio",
      "Kontak langsung via WhatsApp, tanpa perantara",
    ],
    cta: "Pasang Iklan",
  },
  {
    productType: "Paket_Plus",
    subtitle: "Untuk yang sering pasang iklan",
    badge: "Populer",
    priceSuffix: "berlaku 90 hari",
    features: [
      "3 kuota Iklan Tawarkan Jasa",
      "2 kuota Cari Jasa Prioritas",
      "Lebih hemat dari beli satuan",
      "Berlaku 90 hari sejak pembelian",
    ],
    cta: "Pilih Paket Plus",
    featured: true,
  },
];

const OTHER_PRODUCTS: { productType: OrderProductType; description: string }[] = [
  {
    productType: "Cari_Jasa_Prioritas",
    description: "Permintaan jasamu tampil menonjol (pin to top) selama 3 hari.",
  },
  {
    productType: "Traktir_Platform",
    description: "Donasi sukarela sebagai apresiasi untuk pengembangan layanan Nemshi.",
  },
];

function CheckIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="h-5 w-5 shrink-0 text-accent">
      <path
        d="M4 10.5L8 14.5L16 6.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function BayarPage() {
  const router = useRouter();
  const [loadingProduct, setLoadingProduct] = useState<OrderProductType | null>(null);

  async function handlePilih(productType: OrderProductType) {
    setLoadingProduct(productType);
    const response = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productType }),
    });

    if (response.status === 401) {
      router.push("/masuk?redirectTo=/bayar");
      return;
    }

    const order = await response.json();
    router.push(`/bayar/${order.id}`);
  }

  return (
    <div className="bg-text text-white">
      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">
            Pasang Iklan Tanpa Ribet.
          </h1>
          <p className="mt-4 text-lg text-white/60">
            Bayar sekali untuk publikasikan jasamu ke seluruh Masisir di Mesir — tanpa
            langganan, tanpa komisi transaksi.
          </p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2">
          {PLAN_CARDS.map((plan) => (
            <div
              key={plan.productType}
              className={`flex flex-col rounded-3xl p-8 ${
                plan.featured ? "bg-white text-text" : "border border-white/15 bg-white/5"
              }`}
            >
              <div className="flex items-center gap-2">
                <h2 className="font-display text-xl font-semibold">
                  {PRODUCT_LABELS[plan.productType]}
                </h2>
                {plan.badge && (
                  <span className="rounded-full bg-accent px-2.5 py-0.5 text-xs font-semibold text-white">
                    {plan.badge}
                  </span>
                )}
              </div>
              <p className={`mt-1 text-sm ${plan.featured ? "text-text-secondary" : "text-white/60"}`}>
                {plan.subtitle}
              </p>

              <div className="mt-6 flex items-baseline gap-2">
                <span className="font-display text-4xl font-bold">
                  {formatRupiah(PRODUCT_PRICES[plan.productType])}
                </span>
                <span className={`text-sm ${plan.featured ? "text-text-secondary" : "text-white/60"}`}>
                  {plan.priceSuffix}
                </span>
              </div>

              <button
                onClick={() => handlePilih(plan.productType)}
                disabled={loadingProduct !== null}
                className={`mt-6 rounded-full px-5 py-3 text-sm font-semibold transition-transform hover:scale-[1.02] disabled:opacity-60 ${
                  plan.featured
                    ? "bg-primary text-white"
                    : "border border-white/20 bg-white text-text"
                }`}
              >
                {loadingProduct === plan.productType ? "Memproses..." : plan.cta}
              </button>

              <ul className="mt-8 flex flex-col gap-3 text-sm">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5">
                    <CheckIcon />
                    <span className={plan.featured ? "text-text" : "text-white/80"}>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mx-auto mt-6 grid max-w-3xl gap-4 sm:grid-cols-2">
          {OTHER_PRODUCTS.map(({ productType, description }) => (
            <div
              key={productType}
              className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/15 bg-white/5 p-5"
            >
              <div>
                <h3 className="font-semibold">{PRODUCT_LABELS[productType]}</h3>
                <p className="text-sm text-white/60">{description}</p>
                <p className="mt-1 font-display font-semibold text-white">
                  {formatRupiah(PRODUCT_PRICES[productType])}
                </p>
              </div>
              <button
                onClick={() => handlePilih(productType)}
                disabled={loadingProduct !== null}
                className="shrink-0 rounded-full border border-white/20 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/10 disabled:opacity-60"
              >
                {loadingProduct === productType ? "Memproses..." : "Pilih"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
