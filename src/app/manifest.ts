import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Nemsy! - Portal Iklan Baris Masisir",
    short_name: "Nemsy!",
    description:
      "Portal kecil buat jual-beli, cari jasa, dan minta bantuan sesama Masisir di Mesir.",
    start_url: "/",
    display: "standalone",
    background_color: "#FFF8E6",
    theme_color: "#FFC72C",
    icons: [
      { src: "/icon.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icon.png", sizes: "192x192", type: "image/png", purpose: "any" },
    ],
  };
}
