import type { Metadata } from "next";
import { Black_Han_Sans, Manrope } from "next/font/google";
import localFont from "next/font/local";
import "leaflet/dist/leaflet.css";
import "./globals.css";

const sora = localFont({
  src: [
    { path: "../fonts/Sora-Regular.ttf", weight: "400", style: "normal" },
    { path: "../fonts/Sora-Bold.ttf", weight: "700", style: "normal" },
  ],
  variable: "--font-sora",
  display: "swap",
});

const blackHanSans = Black_Han_Sans({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-black-han-sans",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Nemsy! Platform Iklan Baris Masisir",
  description:
    "Nemsy! membantu mahasiswa Indonesia di Mesir mencari dan menawarkan produk maupun jasa dengan mudah.",
  icons: {
    icon: [
      { url: "/icon.png", type: "image/png" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${sora.variable} ${blackHanSans.variable} ${manrope.variable} h-full antialiased`}
    >
      <body className="min-h-full font-sans text-ink">{children}</body>
    </html>
  );
}
