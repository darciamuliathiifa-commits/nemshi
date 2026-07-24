import Image from "next/image";
import { PublicNav } from "@/components/layout/public-nav";
import { GoogleLoginButton } from "@/components/auth/google-login-button";
import {
  ChatIcon,
  CompassIcon,
  MegaphoneIcon,
  PlusCircleIcon,
} from "@/components/icons";

const features = [
  {
    icon: CompassIcon,
    title: "Eksplor Iklan",
    description: "Cari produk dan jasa berdasarkan kategori, lokasi, dan kata kunci.",
  },
  {
    icon: PlusCircleIcon,
    title: "Pasang Iklan Gratis",
    description: "Slot iklan pertama gratis untuk mulai berjualan atau menawarkan jasa.",
  },
  {
    icon: MegaphoneIcon,
    title: "Sayembara Jasa",
    description: "Butuh bantuan? Pasang pengumuman dan biarkan komunitas mendaftar.",
  },
  {
    icon: ChatIcon,
    title: "Langsung via WhatsApp",
    description: "Hubungi pengiklan secara langsung tanpa perantara.",
  },
];

export default function LandingPage() {
  return (
    <div className="flex h-screen flex-col overflow-hidden bg-white">
      <div className="relative overflow-hidden bg-brand bg-dot-pattern pb-8 sm:pb-12">
        <PublicNav />

        <div className="flex flex-col items-center px-6 pb-4 pt-4 text-center">
          <div className="relative flex w-full max-w-2xl items-center justify-center">
            <div className="pointer-events-none absolute -left-4 top-1/2 hidden -translate-y-1/2 select-none sm:-left-8 sm:block lg:-left-16">
              <Image
                src="/flag-indonesia.png"
                alt=""
                width={1161}
                height={787}
                aria-hidden
                className="absolute -top-6 left-1/2 w-9 -translate-x-1/2 -rotate-6 animate-[float-c_5s_ease-in-out_infinite] sm:-top-7 sm:w-10 lg:-top-8 lg:w-12"
              />
              <Image
                src="/nemsy-char-1-v3.png"
                alt=""
                width={1090}
                height={1317}
                className="w-[86px] animate-[float-a_6s_ease-in-out_infinite] sm:w-[100px] lg:w-[120px]"
              />
            </div>

            <Image
              src="/nemsy-logo-fix.png"
              alt="Nemsy — Satu Portal Untuk Usaha Masisir"
              width={2964}
              height={1122}
              priority
              className="h-auto w-full max-w-md sm:max-w-lg"
            />

            <div className="pointer-events-none absolute -right-4 top-1/2 hidden -translate-y-1/2 select-none sm:-right-8 sm:block lg:-right-14">
              <Image
                src="/flag-mesir.png"
                alt=""
                width={1161}
                height={787}
                aria-hidden
                className="absolute -top-6 left-1/2 w-9 -translate-x-1/2 rotate-6 animate-[float-d_5.5s_ease-in-out_infinite] sm:-top-7 sm:w-10 lg:-top-8 lg:w-11"
              />
              <Image
                src="/nemsy-char-2-v3.png"
                alt=""
                width={939}
                height={1209}
                className="w-[78px] animate-[float-b_7s_ease-in-out_infinite] sm:w-[90px] lg:w-[108px]"
              />
            </div>
          </div>

          <p className="mt-4 max-w-xl text-base font-normal leading-6 text-charcoal/70">
            Pusat kebutuhan dan peluang Masisir - tempat produk, jasa, dan
            orang yang tepat bertemu untuk menjadikan keseharian di Mesir
            lebih mudah.
          </p>

          <div className="mt-5">
            <GoogleLoginButton />
          </div>
        </div>

        <svg
          className="pointer-events-none absolute bottom-0 left-0 h-8 w-full sm:h-12"
          viewBox="0 0 1440 120"
          preserveAspectRatio="none"
          fill="white"
          aria-hidden="true"
        >
          <path d="M0,40 Q720,110 1440,40 L1440,120 L0,120 Z" />
        </svg>
      </div>

      <div className="flex flex-1 items-center justify-center overflow-hidden px-6">
        <div className="grid w-full max-w-4xl grid-cols-2 gap-3 sm:grid-cols-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="flex flex-col items-center gap-2 rounded-card border-[2.5px] border-ink bg-white p-4 text-center shadow-[3px_3px_0_0_rgba(20,20,20,1)] transition-transform duration-200 hover:-translate-y-1.5 hover:shadow-[5px_5px_0_0_rgba(20,20,20,1)]"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-cream text-charcoal">
                <feature.icon width={20} height={20} />
              </span>
              <span className="text-[13px] font-bold text-charcoal">
                {feature.title}
              </span>
              <span className="hidden text-[12px] font-normal text-charcoal/60 sm:block">
                {feature.description}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
