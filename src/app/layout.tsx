import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const sora = localFont({
  src: [
    { path: "../fonts/Sora-Regular.ttf", weight: "400", style: "normal" },
    { path: "../fonts/Sora-Bold.ttf", weight: "700", style: "normal" },
  ],
  variable: "--font-sora",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Nemshi — Platform Iklan Baris Masisir",
  description:
    "Nemshi membantu mahasiswa Indonesia di Mesir mencari dan menawarkan produk maupun jasa dengan mudah.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${sora.variable} h-full antialiased`}>
      <body className="min-h-full font-sans text-ink">{children}</body>
    </html>
  );
}
