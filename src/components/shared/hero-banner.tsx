import Image from "next/image";

// Three independently-positioned layers (logo + two character crops) on top
// of the section's own gradient/dot-pattern background, instead of a single
// flat banner image forced through object-fit. This is what actually keeps
// the logo and both characters fully visible and proportional at every
// breakpoint — a single image can only ever crop or letterbox once the
// container's aspect ratio stops matching the source image's.
export function HeroBanner() {
  return (
    <div className="relative h-[180px] overflow-hidden sm:h-[280px] lg:h-[360px] xl:h-[440px]">
      {/* Left character — hidden on mobile; a fixed-ratio crop, not the full
          banner, so it never needs to be cropped further by CSS. */}
      <div className="absolute bottom-0 left-2 hidden sm:block sm:left-6 lg:left-6 xl:left-8">
        <Image
          src="/banner-char-left.png"
          alt=""
          aria-hidden
          width={1450}
          height={989}
          className="h-[110px] w-auto sm:h-[110px] lg:h-[180px] xl:h-[240px]"
          priority
        />
      </div>

      {/* Right character — mirrors the left. */}
      <div className="absolute bottom-0 right-2 hidden sm:block sm:right-6 lg:right-6 xl:right-8">
        <Image
          src="/banner-char-right.png"
          alt=""
          aria-hidden
          width={1450}
          height={989}
          className="h-[110px] w-auto sm:h-[110px] lg:h-[180px] xl:h-[240px]"
          priority
        />
      </div>

      {/* Logo — always centered, always fully clear of both characters and
          the top edge (safe margin enforced via the top offset). */}
      <div className="absolute left-1/2 top-1/2 w-[160px] -translate-x-1/2 -translate-y-1/2 sm:left-1/2 sm:top-7 sm:w-[160px] sm:translate-y-0 lg:top-8 lg:w-[220px] xl:top-10 xl:w-[280px]">
        <Image
          src="/nemsy-logo-fix.png"
          alt="Nemsy!"
          width={2964}
          height={1122}
          className="h-auto w-full"
          priority
        />
      </div>
    </div>
  );
}
