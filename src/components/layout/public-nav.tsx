"use client";

import { useState } from "react";
import Link from "next/link";
import { LandingLoginButton } from "@/components/auth/google-login-button";
import { CloseIcon, MenuIcon, UserIcon } from "@/components/icons";

const navItems = [
  { label: "Fitur", href: "#fitur" },
  { label: "Sayembara", href: "#sayembara" },
  { label: "Tentang", href: "#tentang" },
  { label: "Peta", href: "#peta" },
  { label: "Pembukaan", href: "#pembukaan" },
];

export function PublicNav() {
  const [open, setOpen] = useState(false);

  return (
    <nav
      aria-label="Navigasi landing page"
      className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-6 sm:pt-4"
    >
      <div className="mx-auto w-full max-w-6xl rounded-[8px] border-[2.5px] border-[#005b4f] bg-[#fffefa]/95 shadow-[4px_4px_0_0_#006451] backdrop-blur">
        <div className="flex h-14 items-center gap-2 px-2 sm:h-16 sm:px-3">
          <Link
            href="#top"
            onClick={() => setOpen(false)}
            className="font-landing-display shrink-0 px-2 text-lg uppercase text-[#005b4f] sm:text-xl"
          >
            Nemsyi
          </Link>

          <div className="ml-auto hidden items-center gap-1 lg:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-pill px-3 py-2 text-sm font-extrabold text-[#005b4f]/72 transition-colors hover:bg-[#fff47d] hover:text-[#005b4f]"
              >
                {item.label}
              </Link>
            ))}
          </div>

          <LandingLoginButton
            ariaLabel="Login ke Nemsyi"
            className="ml-auto hidden h-10 items-center justify-center gap-2 rounded-pill bg-[#005b4f] px-4 text-sm font-extrabold text-[#fff47d] lg:ml-2 lg:flex"
          >
            <UserIcon width={17} height={17} />
            Masuk
          </LandingLoginButton>

          <button
            type="button"
            onClick={() => setOpen((current) => !current)}
            aria-expanded={open}
            aria-controls="landing-mobile-menu"
            aria-label={open ? "Tutup menu" : "Buka menu"}
            className="ml-auto flex h-10 w-10 items-center justify-center rounded-[6px] border-2 border-[#005b4f] text-[#005b4f] transition-colors hover:bg-[#fff47d] lg:hidden"
          >
            {open ? (
              <CloseIcon width={21} height={21} />
            ) : (
              <MenuIcon width={21} height={21} />
            )}
          </button>
        </div>

        {open && (
          <div
            id="landing-mobile-menu"
            className="border-t-2 border-[#005b4f] p-2 lg:hidden"
          >
            <div className="grid grid-cols-2 gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="flex min-h-11 items-center rounded-[6px] bg-[#dff8e8] px-3 text-sm font-extrabold text-[#005b4f] transition-colors hover:bg-[#fff47d]"
                >
                  {item.label}
                </Link>
              ))}
            </div>
            <LandingLoginButton
              ariaLabel="Login ke Nemsyi"
              className="mt-2 flex h-11 w-full items-center justify-center gap-2 rounded-[6px] bg-[#005b4f] px-4 text-sm font-extrabold text-[#fff47d]"
            >
              <UserIcon width={17} height={17} />
              Masuk ke Nemsyi
            </LandingLoginButton>
          </div>
        )}
      </div>
    </nav>
  );
}
