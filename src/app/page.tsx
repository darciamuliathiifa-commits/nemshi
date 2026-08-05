import Image from "next/image";
import Link from "next/link";
import { LandingLoginButton } from "@/components/auth/google-login-button";
import { CairoCommunityMap } from "@/components/landing/cairo-community-map";
import { LandingMotion } from "@/components/landing/landing-motion";
import {
  ChatIcon,
  CompassIcon,
  MegaphoneIcon,
  PlusCircleIcon,
  SearchIcon,
  StoreIcon,
  UserIcon,
  UsersIcon,
} from "@/components/icons";
import { PublicNav } from "@/components/layout/public-nav";

const heroScreens = [
  {
    title: "Cari barang",
    subtitle: "Filter cepat buat kebutuhan harian Masisir.",
    color: "bg-[#80e6ad]",
  },
  {
    title: "Pasang iklan",
    subtitle: "Produk, jasa, dan sayembara dalam satu portal.",
    color: "bg-[#fff47d]",
  },
  {
    title: "Chat langsung",
    subtitle: "Kontak penjual tanpa alur yang ribet.",
    color: "bg-[#ff9caf]",
  },
];

const headlinePieces = ["TEMUKAN", "BARANG", "JASA", "DAN", "PELUANG"];

const capabilities = [
  {
    icon: CompassIcon,
    eyebrow: "jelajahi",
    title: "Lapak Masisir di satu tempat",
    copy: "Cari produk, jasa, dan kebutuhan harian dengan kategori yang rapi.",
  },
  {
    icon: PlusCircleIcon,
    eyebrow: "pasang",
    title: "Iklan pertama tetap gratis",
    copy: "Mulai jualan tanpa biaya awal, lalu upgrade saat butuh dorongan lebih.",
  },
  {
    icon: MegaphoneIcon,
    eyebrow: "sayembara",
    title: "Bikin panggilan bantuan",
    copy: "Butuh desain, terjemahan, titip beli, atau kerja cepat? Umumkan saja.",
  },
  {
    icon: ChatIcon,
    eyebrow: "kontak",
    title: "Langsung lanjut WhatsApp",
    copy: "Nemsyi jadi tempat ketemu, obrolannya tetap cepat dan personal.",
  },
];

const errands = [
  "cari rice cooker",
  "jual buku kuliah",
  "titip beli obat",
  "butuh jasa desain",
  "sewa kamar",
  "cari penerjemah",
  "jual motor",
  "open trip",
];

export default function LandingPage() {
  return (
    <main
      data-landing-root
      className="font-landing-body min-h-screen overflow-hidden bg-[#fffefa] text-[#005b4f]"
    >
      <LandingMotion />
      <section id="top" className="relative min-h-[92svh] scroll-mt-24 bg-[#fff47d]">
        <div className="landing-dots absolute inset-0 bg-[radial-gradient(rgba(0,91,79,0.14)_1.2px,transparent_1.2px)] bg-[length:24px_24px]" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-[#80e6ad] [clip-path:ellipse(75%_58%_at_50%_100%)]" />
        <PublicNav />

        <div className="relative mx-auto flex min-h-[92svh] w-full max-w-7xl flex-col items-center justify-center px-5 pb-10 pt-24 text-center sm:px-8 sm:pb-8 sm:pt-24 lg:justify-start lg:px-10 lg:pb-4 lg:pt-24">
          <div data-reveal className="relative z-40 flex w-full flex-col items-center">
            <p className="text-[12px] font-black uppercase tracking-[0.42em] text-[#005b4f]/70 sm:text-[14px]">
              meet nemsyi
            </p>
            <h1 className="mt-4 max-w-5xl text-[clamp(2.55rem,8vw,6.8rem)] font-black leading-[0.92] text-[#005b4f] sm:leading-[0.88] lg:text-[4rem] xl:text-[4.5rem]">
              Portal kecil buat hidup Masisir yang rame.
            </h1>
            <p className="mt-5 max-w-2xl text-[15px] font-semibold leading-6 text-[#005b4f]/75 sm:mt-6 sm:text-xl sm:leading-7">
              Jual, cari, titip, dan minta bantuan tanpa harus tenggelam di
              grup chat yang tidak ada ujungnya.
            </p>
            <div className="mt-6 flex w-full max-w-xs flex-col items-stretch gap-3 sm:w-auto sm:max-w-none sm:flex-row sm:items-center">
              <LandingLoginButton
                ariaLabel="Login untuk mulai menjelajahi Nemsyi"
                className="landing-cta-pulse flex h-12 items-center justify-center gap-2 rounded-pill border-[2.5px] border-[#005b4f] bg-[#005b4f] px-7 text-base font-black text-[#fff47d] transition-transform hover:-translate-y-1"
              >
                <CompassIcon width={18} height={18} />
                Mulai jelajahi
              </LandingLoginButton>
              <LandingLoginButton
                ariaLabel="Login untuk memasang iklan"
                className="flex h-12 items-center justify-center gap-2 rounded-pill border-[2.5px] border-[#005b4f] bg-[#fffefa] px-7 text-base font-black text-[#005b4f] transition-transform hover:-translate-y-1"
              >
                <PlusCircleIcon width={18} height={18} />
                Pasang iklan
              </LandingLoginButton>
            </div>
          </div>

          <div className="relative mt-10 h-[340px] w-full max-w-sm sm:mt-12 sm:h-[480px] sm:max-w-4xl lg:absolute lg:inset-x-0 lg:bottom-5 lg:mx-auto lg:mt-0 lg:h-[370px] lg:max-w-3xl">
            {heroScreens.map((screen, index) => (
              <div
                key={screen.title}
                className={`absolute bottom-0 h-[300px] w-[48%] overflow-hidden rounded-[24px] border-[2.5px] border-[#005b4f] bg-[#fffefa] text-left shadow-[7px_9px_0_0_#006451] sm:h-[430px] sm:w-[34%] sm:rounded-[34px] lg:h-[350px] lg:w-[31%] lg:rounded-[28px] ${
                  index === 0
                    ? "left-[1%] z-20 -rotate-6 sm:left-[5%]"
                    : index === 1
                      ? "left-1/2 z-30 h-[325px] w-[52%] -translate-x-1/2 rotate-1 sm:h-[460px] sm:w-[36%] lg:h-[360px] lg:w-[33%]"
                      : "right-[1%] z-10 rotate-6 sm:right-[5%]"
                }`}
              >
                <div
                  className={`landing-phone-float relative flex h-full flex-col p-2.5 sm:p-4 lg:p-3 ${
                    index === 1
                      ? "landing-phone-delay-1"
                      : index === 2
                        ? "landing-phone-delay-2"
                        : ""
                  }`}
                >
                  <div className="mb-3 flex items-center justify-between px-1 text-[7px] font-extrabold text-[#005b4f] sm:mb-5 sm:text-[10px] lg:mb-3 lg:text-[8px]">
                    <span>9:41</span>
                    <span className="absolute left-1/2 top-2.5 h-3 w-12 -translate-x-1/2 rounded-full bg-[#005b4f] sm:top-4 sm:h-4 sm:w-20 lg:top-3 lg:h-3 lg:w-16" />
                    <span>5G &#9679;</span>
                  </div>

                  <div className="min-w-0 px-1">
                    <p className="text-[8px] font-extrabold uppercase tracking-[0.16em] text-[#005b4f]/65 sm:text-[11px] lg:text-[9px]">
                      Nemsyi portal
                    </p>
                    <h2 className="mt-1 truncate text-[15px] leading-none text-[#005b4f] sm:text-[26px] lg:text-xl">
                      {screen.title}
                    </h2>
                    <p className="mt-1.5 line-clamp-2 text-[7px] font-semibold leading-[1.35] text-charcoal/55 sm:mt-2 sm:text-[10px] lg:mt-1.5 lg:text-[8px]">
                      {screen.subtitle}
                    </p>
                  </div>

                  <div className="mt-3 flex h-7 items-center gap-1.5 rounded-full bg-[#f3f1ec] px-2.5 text-[7px] font-bold text-charcoal/45 sm:mt-4 sm:h-10 sm:px-4 sm:text-[10px] lg:mt-3 lg:h-8 lg:px-3 lg:text-[8px]">
                    <SearchIcon width={13} height={13} />
                    Cari kebutuhanmu
                  </div>

                  <div className="mt-3 grid grid-cols-3 gap-1.5 sm:mt-4 sm:gap-2 lg:mt-3 lg:gap-1.5">
                    <div className="flex aspect-square items-center justify-center rounded-[8px] bg-[#ff9caf]">
                      <StoreIcon width={18} height={18} />
                    </div>
                    <div className="flex aspect-square items-center justify-center rounded-[8px] bg-[#bce86b]">
                      <MegaphoneIcon width={18} height={18} />
                    </div>
                    <div className="flex aspect-square items-center justify-center rounded-[8px] bg-[#8fc9f4]">
                      <UsersIcon width={18} height={18} />
                    </div>
                  </div>

                  <div className="mt-3 space-y-1.5 sm:mt-4 sm:space-y-2 lg:mt-3 lg:space-y-1.5">
                    {["Populer di Kairo", "Baru ditambahkan"].map((label, itemIndex) => (
                      <div
                        key={label}
                        className="flex items-center gap-2 rounded-[8px] border border-[#005b4f]/15 bg-white p-1.5 sm:p-2"
                      >
                        <div
                          className={`h-7 w-7 shrink-0 rounded-[6px] sm:h-10 sm:w-10 ${
                            itemIndex === 0 ? screen.color : "bg-[#fff47d]"
                          }`}
                        />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-[7px] font-extrabold text-[#005b4f] sm:text-[10px]">
                            {label}
                          </p>
                          <div className="mt-1 h-1 w-3/4 rounded-full bg-charcoal/10 sm:h-1.5" />
                        </div>
                        <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#005b4f] text-[8px] text-white sm:h-6 sm:w-6">
                          &rsaquo;
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-auto grid h-8 grid-cols-4 items-center rounded-full border border-[#005b4f]/15 bg-white px-2 text-[#005b4f] sm:h-11 sm:px-4 lg:h-8 lg:px-3">
                    <CompassIcon width={14} height={14} />
                    <SearchIcon width={14} height={14} />
                    <ChatIcon width={14} height={14} />
                    <UsersIcon width={14} height={14} />
                  </div>
                </div>
              </div>
            ))}

            <Image
              src="/nemsy-char-1-v3.png"
              alt=""
              width={1090}
              height={1317}
              aria-hidden
              className="pointer-events-none absolute -left-1 bottom-0 z-40 w-14 -rotate-12 select-none sm:left-[2%] sm:w-24"
            />
            <Image
              src="/nemsy-char-2-v3.png"
              alt=""
              width={939}
              height={1209}
              aria-hidden
              className="pointer-events-none absolute -right-1 bottom-8 z-40 w-14 rotate-12 select-none sm:right-[2%] sm:bottom-12 sm:w-24"
            />
          </div>
        </div>
      </section>

      <section className="relative bg-[#80e6ad] px-5 py-16 sm:px-8 sm:py-24">
        <div data-reveal className="mx-auto max-w-7xl">
          <h2 className="space-y-2 text-center text-[clamp(2.25rem,9vw,8rem)] font-black uppercase leading-[0.84] tracking-normal sm:space-y-1 sm:leading-[0.8]">
            {headlinePieces.map((piece) => (
              <span key={piece} className="block min-w-0">
                {piece}
              </span>
            ))}
          </h2>

          <p className="mx-auto mt-8 max-w-2xl text-center text-lg font-bold leading-8 text-[#005b4f]/75 sm:text-2xl">
            Lebih cepat dari scroll grup satu per satu, lebih rapi dari catatan
            yang hilang di chat.
          </p>
        </div>
      </section>

      <section id="fitur" className="scroll-mt-24 bg-[#fff47d] px-5 py-12 sm:px-8 sm:py-16">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[0.72fr_1.28fr] lg:items-center">
          <div data-reveal>
            <p className="text-[12px] font-black uppercase tracking-[0.38em]">
              with nemsyi you can
            </p>
            <h2 className="mt-3 max-w-2xl text-[clamp(2.2rem,6vw,4.8rem)] font-black leading-[0.9]">
              Bikin urusan kecil jadi beres.
            </h2>
          </div>

          <div className="landing-stagger grid gap-4 sm:grid-cols-2">
            {capabilities.map((item, index) => (
              <article
                data-reveal
                key={item.title}
                className={`landing-card-lift flex min-h-44 flex-col rounded-[8px] border-[2.5px] border-[#005b4f] p-4 shadow-[5px_5px_0_0_#006451] sm:min-h-48 ${
                  index % 3 === 0 ? "bg-[#80e6ad]" : "bg-[#fffefa]"
                }`}
              >
                <div className="mb-4 flex items-center justify-between">
                  <span className="rounded-pill border-2 border-[#005b4f] bg-[#fff47d] px-2.5 py-1 text-[10px] font-black uppercase">
                    {item.eyebrow}
                  </span>
                  <item.icon width={24} height={24} />
                </div>
                <h3 className="text-xl font-black leading-[1.05] sm:text-[22px]">
                  {item.title}
                </h3>
                <p className="mt-2.5 text-[13px] font-semibold leading-5 text-[#005b4f]/70 sm:text-sm">
                  {item.copy}
                </p>
              </article>
            ))}
          </div>

          <div
            id="sayembara"
            data-reveal
            className="mt-2 grid scroll-mt-24 overflow-hidden rounded-[8px] border-[3px] border-[#005b4f] bg-[#ff9caf] shadow-[6px_6px_0_0_#006451] lg:col-span-2 lg:grid-cols-[0.9fr_1.1fr]"
          >
            <div className="p-5 sm:p-7 lg:p-8">
              <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.18em]">
                <MegaphoneIcon width={20} height={20} />
                Fitur Sayembara
              </div>
              <h2 className="mt-4 max-w-xl text-[clamp(2rem,5vw,4rem)] leading-[0.9]">
                Butuh bantuan? Buka sayembara.
              </h2>
              <p className="mt-4 max-w-xl text-sm font-semibold leading-6 text-[#005b4f]/75 sm:text-base">
                Umumkan kebutuhanmu ke Masisir, tentukan imbalannya, lalu pilih
                bantuan yang paling cocok tanpa mencari satu per satu.
              </p>
            </div>

            <div className="flex flex-col justify-between border-t-[3px] border-[#005b4f] bg-[#fffefa] p-5 sm:p-7 lg:border-l-[3px] lg:border-t-0 lg:p-8">
              <div className="space-y-3">
                {[
                  "Tulis kebutuhan dengan jelas",
                  "Tentukan imbalan dan lokasi",
                  "Pilih bantuan yang paling cocok",
                ].map((step, index) => (
                  <div
                    key={step}
                    className="flex items-center gap-3 border-b-2 border-[#005b4f]/15 pb-3 text-sm font-extrabold sm:text-base"
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#005b4f] text-[11px] text-[#fff47d]">
                      {index + 1}
                    </span>
                    {step}
                  </div>
                ))}
              </div>
              <LandingLoginButton
                ariaLabel="Login untuk membuat sayembara"
                className="landing-cta-pulse mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-pill bg-[#005b4f] px-6 text-base font-extrabold text-[#fff47d]"
              >
                <MegaphoneIcon width={18} height={18} />
                Buat sayembara
              </LandingLoginButton>
            </div>
          </div>
        </div>
      </section>

      <section id="tentang" className="relative scroll-mt-24 bg-[#fffefa] px-5 py-16 sm:px-8 sm:py-24">
        <div data-reveal className="mx-auto max-w-5xl text-center">
          <div className="flex flex-col items-center">
            <p className="text-xl font-black">Nemsyi dimulai dari satu ide:</p>
            <h2 className="mt-4 text-[clamp(3.2rem,8vw,7rem)] font-black leading-[0.88]">
              Masisir butuh portal yang ringan.
            </h2>
            <p className="mt-6 max-w-3xl text-lg font-bold leading-8 text-[#005b4f]/75">
              Bukan marketplace yang kaku. Bukan grup yang tenggelam. Nemsyi
              adalah tempat orang Mesir-Indonesia saling menemukan kebutuhan,
              peluang, dan bantuan dengan lebih manusiawi.
            </p>
            <LandingLoginButton
              ariaLabel="Login untuk melanjutkan ke Nemsyi"
              className="mt-7 inline-flex h-12 items-center justify-center rounded-pill border-[2.5px] border-[#005b4f] bg-[#fff47d] px-7 text-base font-black shadow-[4px_4px_0_0_#006451] transition-transform hover:-translate-y-1"
            >
              Cerita Nemsyi
            </LandingLoginButton>
          </div>
        </div>
      </section>

      <section id="peta" className="scroll-mt-24 bg-[#fff47d] px-5 py-16 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-7xl">
          <div data-reveal className="mb-8 grid gap-4 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.32em] sm:text-[12px]">
                Cairo, Egypt
              </p>
              <h2 className="mt-3 text-[clamp(2.6rem,8vw,5.8rem)] leading-[0.9]">
                Cari kebutuhan dari kawasan terdekat.
              </h2>
            </div>
            <div className="max-w-2xl lg:justify-self-end">
              <p className="text-sm font-semibold leading-6 text-[#005b4f]/72 sm:text-base sm:leading-7">
                Pilih kawasan tempat tinggal untuk mengenali pusat aktivitas
                Masisir, lalu lanjut jelajahi barang dan jasa yang kamu butuhkan.
              </p>
              <LandingLoginButton
                ariaLabel="Login untuk menjelajahi iklan sekitar"
                className="mt-4 inline-flex h-11 items-center justify-center gap-2 rounded-pill bg-[#005b4f] px-5 text-sm font-extrabold text-[#fff47d] transition-transform hover:-translate-y-0.5"
              >
                <SearchIcon width={17} height={17} />
                Jelajahi iklan sekitar
              </LandingLoginButton>
            </div>
          </div>

          <div data-reveal>
            <CairoCommunityMap />
          </div>
        </div>
      </section>

      <section className="bg-[#80e6ad] px-5 py-16 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-7xl">
          <div data-reveal className="mb-8 max-w-3xl sm:mb-12">
            <p className="text-[11px] font-black uppercase tracking-[0.32em] sm:text-[12px]">
              kebutuhan sehari-hari
            </p>
            <h2 className="mt-3 text-[clamp(2.35rem,9vw,5.4rem)] leading-[0.9]">
              Yang sering dicari Masisir.
            </h2>
          </div>

          <div className="landing-stagger grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
            {errands.map((item, index) => (
              <div
                data-reveal
                key={item}
                className={`landing-card-lift flex min-h-24 flex-col justify-between rounded-[8px] border-[2.5px] border-[#005b4f] p-3 text-left shadow-[4px_4px_0_0_#006451] sm:min-h-28 sm:p-4 ${
                  index % 2 === 0 ? "bg-[#fff47d]" : "bg-[#fffefa]"
                }`}
              >
                <div className="flex items-center justify-between text-[10px] font-extrabold text-[#005b4f]/60 sm:text-[11px]">
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <span aria-hidden className="text-base leading-none">
                    {"\u2197"}
                  </span>
                </div>
                <p className="mt-4 text-[15px] font-extrabold uppercase leading-[1.2] sm:text-xl">
                  {item}
                </p>
              </div>
            ))}
          </div>

          <div id="pembukaan" data-reveal className="mt-14 scroll-mt-24 border-t-2 border-[#005b4f]/20 pt-12">
            <div className="grid overflow-hidden rounded-[8px] border-[3px] border-[#005b4f] bg-[#fffefa] shadow-[7px_7px_0_0_#006451] lg:grid-cols-[1.15fr_0.85fr]">
              <div className="p-6 sm:p-9 lg:p-12">
                <div className="inline-flex items-center gap-2 rounded-pill border-2 border-[#005b4f] bg-[#ff9caf] px-3 py-1.5 text-xs font-extrabold">
                  <span className="h-2 w-2 rounded-full bg-[#005b4f]" />
                  Event pembukaan
                </div>
                <h2 className="mt-5 max-w-2xl text-[clamp(2.4rem,7vw,5.4rem)] leading-[0.9]">
                  Isi lapak pertama Nemsyi.
                </h2>
                <p className="mt-5 max-w-xl text-base font-semibold leading-7 text-[#005b4f]/72 sm:text-lg">
                  Nemsyi baru dibuka untuk Masisir. Jadilah bagian dari etalase
                  awal dengan memasang barang, jasa, atau kebutuhan pertamamu.
                </p>
              </div>

              <div className="flex flex-col justify-between border-t-[3px] border-[#005b4f] bg-[#fff47d] p-6 sm:p-9 lg:border-l-[3px] lg:border-t-0 lg:p-10">
                <div className="space-y-4">
                  {[
                    "Iklan perdana gratis",
                    "Tampil di etalase pembukaan",
                    "Terbuka untuk seluruh Masisir",
                  ].map((benefit) => (
                    <div
                      key={benefit}
                      className="flex items-center gap-3 border-b-2 border-[#005b4f]/18 pb-4 text-sm font-extrabold sm:text-base"
                    >
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#005b4f] text-[#fff47d]">
                        {"\u2713"}
                      </span>
                      {benefit}
                    </div>
                  ))}
                </div>
                <div className="mt-7 grid gap-3">
                  <LandingLoginButton
                    ariaLabel="Login untuk menjelajahi event pembukaan"
                    className="landing-cta-pulse flex h-12 items-center justify-center gap-2 rounded-pill bg-[#005b4f] px-6 text-base font-extrabold text-[#fff47d]"
                  >
                    <CompassIcon width={18} height={18} />
                    Jelajahi pembukaan
                  </LandingLoginButton>
                  <LandingLoginButton
                    ariaLabel="Login untuk memasang iklan pertama"
                    className="flex h-12 items-center justify-center gap-2 rounded-pill border-[2.5px] border-[#005b4f] px-6 text-base font-extrabold"
                  >
                    <PlusCircleIcon width={18} height={18} />
                    Pasang iklan pertama
                  </LandingLoginButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#005b4f] px-5 py-16 text-center text-[#fffefa] sm:px-8 sm:py-24">
        <div data-reveal>
          <h2 className="mx-auto max-w-4xl text-[clamp(3rem,10vw,7rem)] font-black leading-[0.88]">
            Buka Nemsyi, beresin hari ini.
          </h2>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <LandingLoginButton
              ariaLabel="Login untuk mulai menjelajahi Nemsyi"
              className="landing-cta-pulse flex h-12 items-center justify-center rounded-pill border-[2.5px] border-[#fff47d] bg-[#fff47d] px-7 text-base font-black text-[#005b4f] transition-transform hover:-translate-y-1"
            >
              Mulai jelajahi
            </LandingLoginButton>
            <LandingLoginButton
              ariaLabel="Login untuk memasang iklan"
              className="flex h-12 items-center justify-center rounded-pill border-[2.5px] border-[#fffefa] bg-transparent px-7 text-base font-black text-[#fffefa] transition-transform hover:-translate-y-1"
            >
              Pasang iklan
            </LandingLoginButton>
          </div>
          <div className="mt-10 border-t border-[#fffefa]/20 pt-8">
            <Link
              href="https://instagram.com/darufm"
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-pill border-2 border-[#fffefa]/75 px-5 text-sm font-extrabold text-[#fffefa] transition-colors hover:border-[#fff47d] hover:bg-[#fff47d] hover:text-[#005b4f]"
            >
              <UserIcon width={17} height={17} />
              Mengenal Dar Dev
            </Link>
          </div>
          <p className="mt-5 text-sm font-bold text-[#fffefa]/65">
            © 2026 Nemsyi - Product by Dar Dev
          </p>
        </div>
      </section>
    </main>
  );
}
