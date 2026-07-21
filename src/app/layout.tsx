import type { Metadata } from "next";

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
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
