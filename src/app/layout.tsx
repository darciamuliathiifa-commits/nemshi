import type { Metadata, Viewport } from "next";
import { Black_Han_Sans, Manrope } from "next/font/google";
import localFont from "next/font/local";
import "leaflet/dist/leaflet.css";
import "./globals.css";
import { DEFAULT_OG_IMAGE, getSiteUrl } from "@/lib/site-url";
import { ServiceWorkerRegister } from "@/components/shared/service-worker-register";
import { InstallPwaBanner } from "@/components/shared/install-pwa-banner";

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

const siteDescription =
  "Nemsy! membantu mahasiswa Indonesia di Mesir mencari dan menawarkan produk maupun jasa dengan mudah.";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#FFC72C",
};

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: "Nemsy! Platform Iklan Baris Masisir",
  description: siteDescription,
  openGraph: {
    type: "website",
    siteName: "Nemsy!",
    locale: "id_ID",
    title: "Nemsy! Platform Iklan Baris Masisir",
    description: siteDescription,
    images: [DEFAULT_OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nemsy! Platform Iklan Baris Masisir",
    description: siteDescription,
    images: [DEFAULT_OG_IMAGE.url],
  },
  icons: {
    icon: [
      { url: "/icon.png", type: "image/png" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: "/apple-icon.png",
  },
  appleWebApp: {
    capable: true,
    title: "Nemsy!",
    statusBarStyle: "default",
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
      <body className="min-h-full font-sans text-ink">
        {children}
        <ServiceWorkerRegister />
        <InstallPwaBanner />
      </body>
    </html>
  );
}
