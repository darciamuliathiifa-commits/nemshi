"use client";

import { usePathname } from "next/navigation";

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div key={pathname} className="motion-safe:animate-[page-enter_0.35s_ease-out]">
      {children}
    </div>
  );
}
