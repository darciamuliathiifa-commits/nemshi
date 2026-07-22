import type { Metadata } from "next";
import { Fraunces, Inter, Plus_Jakarta_Sans } from "next/font/google";
import { SiteChrome } from "@/components/site-chrome";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-fraunces",
});

// Dipakai khusus di panel admin — dashboard internal pakai sans-serif
// fungsional, bukan serif Fraunces yang dipakai di halaman publik.
const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-plus-jakarta-sans",
});

export const metadata: Metadata = {
  title: "Nemshi",
  description: "Direktori iklan jasa untuk Masisir (Mahasiswa Indonesia di Mesir).",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${inter.variable} ${fraunces.variable} ${plusJakartaSans.variable}`}>
      <body>
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
