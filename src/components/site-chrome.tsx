"use client";

import { usePathname } from "next/navigation";
import { AppSidebar } from "@/components/app-sidebar";
import { AppTopbar } from "@/components/app-topbar";
import { LandingHeader } from "@/components/landing-header";
import { SiteFooter } from "@/components/site-footer";

const AUTH_ROUTES = ["/masuk", "/daftar", "/lupa-password", "/reset-password"];

/**
 * Landing (`/`) dan halaman auth pakai header atas biasa tanpa sidebar —
 * sidebar aplikasi baru muncul setelah user masuk ke halaman pencarian/
 * penawaran jasa. Admin punya app-shell sendiri.
 */
export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? "";

  if (pathname.startsWith("/admin")) {
    return <>{children}</>;
  }

  // Halaman landing: header marketing biasa, tanpa sidebar.
  if (pathname === "/") {
    return (
      <div className="flex min-h-screen flex-col">
        <LandingHeader />
        <div className="flex-1">{children}</div>
        <SiteFooter />
      </div>
    );
  }

  // Halaman auth: header marketing, tanpa sidebar & footer (form fokus).
  if (AUTH_ROUTES.includes(pathname)) {
    return (
      <div className="flex min-h-screen flex-col">
        <LandingHeader />
        <div className="flex-1">{children}</div>
      </div>
    );
  }

  // Halaman aplikasi (jelajahi, sayembara, akun, dll): sidebar + topbar.
  return (
    <div className="min-h-screen">
      <AppSidebar />
      <div className="flex min-h-screen flex-col pl-16 sm:pl-20">
        <AppTopbar />
        <div className="flex-1">{children}</div>
        <SiteFooter />
      </div>
    </div>
  );
}
