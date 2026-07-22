import type { NextConfig } from "next";

// Hostname Supabase Storage tempat foto profil/portofolio diunggah —
// diturunkan dari NEXT_PUBLIC_SUPABASE_URL karena beda per environment
// (dev/staging/production), bukan konstanta.
const supabaseHostname = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname
  : undefined;

const nextConfig: NextConfig = {
  images: {
    remotePatterns: supabaseHostname
      ? [
          {
            protocol: "https",
            hostname: supabaseHostname,
          },
        ]
      : [],
  },
};

export default nextConfig;
