"use client";

import { usePathname } from "next/navigation";
import { AppSidebar } from "@/components/app-sidebar";
import { AppTopbar } from "@/components/app-topbar";
import { SiteFooter } from "@/components/site-footer";

/** Admin punya app-shell sendiri (sidebar) — jangan tumpuk sidebar/topbar publik di atasnya. */
export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) {
    return <>{children}</>;
  }

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
