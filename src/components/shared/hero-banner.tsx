import Image from "next/image";

// The banner's own aspect ratio, locked via CSS `aspect-ratio` instead of a
// fixed pixel height. This guarantees the container's shape always matches
// the source image's shape exactly, so object-cover never has anything to
// crop, at any screen width — no per-breakpoint height guessing needed.
export function HeroBanner() {
  return (
    <div className="relative aspect-[4226/1691] w-full overflow-hidden">
      <Image
        src="/banner-nemsy.png"
        alt="Nemsy!: Satu Portal Untuk Usaha Masisir"
        fill
        className="object-cover"
        priority
        sizes="(min-width: 1400px) 1352px, 100vw"
      />
    </div>
  );
}
