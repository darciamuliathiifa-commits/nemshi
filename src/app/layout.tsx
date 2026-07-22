import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { SiteChrome } from "@/components/site-chrome";
import "./globals.css";

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
    <html lang="id" className={plusJakartaSans.variable}>
      <body>
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
