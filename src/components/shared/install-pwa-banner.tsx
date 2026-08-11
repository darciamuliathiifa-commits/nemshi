"use client";

import { useEffect, useState } from "react";
import { CloseIcon } from "@/components/icons";

const DISMISS_KEY = "nemsyi-pwa-install-dismissed";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function InstallPwaBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSHelp, setShowIOSHelp] = useState(false);

  useEffect(() => {
    if (localStorage.getItem(DISMISS_KEY)) return;

    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (navigator as unknown as { standalone?: boolean }).standalone === true;
    if (standalone) return;

    const ios = /iphone|ipad|ipod/i.test(navigator.userAgent);
    setIsIOS(ios);

    // Mark it seen the moment it shows, not just on an explicit dismiss —
    // otherwise closing the tab without tapping X brings it right back on
    // the next visit, which is what made this feel like it never went away.
    if (ios) {
      setVisible(true);
      localStorage.setItem(DISMISS_KEY, "1");
      return;
    }

    function handleBeforeInstallPrompt(event: Event) {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
      setVisible(true);
      localStorage.setItem(DISMISS_KEY, "1");
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    return () =>
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
  }, []);

  function dismiss() {
    setVisible(false);
    localStorage.setItem(DISMISS_KEY, "1");
  }

  async function handleInstall() {
    if (isIOS) {
      setShowIOSHelp(true);
      return;
    }
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    dismiss();
  }

  if (!visible) return null;

  return (
    <>
      <div className="fixed inset-x-0 bottom-0 z-50 flex items-center justify-between gap-3 border-t-[2.5px] border-ink bg-brand px-4 py-3 shadow-[0_-3px_0_0_rgba(20,20,20,1)] sm:bottom-4 sm:left-1/2 sm:right-auto sm:w-full sm:max-w-md sm:-translate-x-1/2 sm:rounded-card sm:border-[2.5px]">
        <div className="min-w-0">
          <p className="text-[13px] font-bold text-charcoal">Pasang Nemsyi di HP kamu</p>
          <p className="truncate text-[11px] font-normal text-charcoal/70">
            Akses lebih cepat langsung dari layar utama
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={handleInstall}
            className="h-9 rounded-pill border-2 border-ink bg-charcoal px-4 text-[12px] font-bold text-white transition-transform hover:-translate-y-0.5"
          >
            Pasang
          </button>
          <button
            type="button"
            onClick={dismiss}
            aria-label="Tutup"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-charcoal/60 hover:bg-charcoal/10"
          >
            <CloseIcon width={16} height={16} />
          </button>
        </div>
      </div>

      {showIOSHelp && (
        <div
          className="fixed inset-0 z-[60] flex items-end justify-center bg-black/50 p-4 sm:items-center"
          onClick={() => setShowIOSHelp(false)}
        >
          <div
            className="w-full max-w-sm rounded-card border-[2.5px] border-ink bg-white p-5 shadow-[4px_4px_0_0_rgba(20,20,20,1)]"
            onClick={(event) => event.stopPropagation()}
          >
            <h3 className="text-base font-bold text-charcoal">Cara Pasang di iPhone</h3>
            <ol className="mt-3 flex flex-col gap-2 text-[13px] font-normal leading-5 text-charcoal">
              <li>1. Ketuk ikon <strong>Share</strong> (kotak dengan panah ke atas) di Safari.</li>
              <li>2. Scroll dan pilih <strong>&ldquo;Add to Home Screen&rdquo;</strong>.</li>
              <li>3. Ketuk <strong>&ldquo;Add&rdquo;</strong> di pojok kanan atas.</li>
            </ol>
            <button
              type="button"
              onClick={() => {
                setShowIOSHelp(false);
                dismiss();
              }}
              className="mt-4 h-10 w-full rounded-pill bg-charcoal text-[13px] font-bold text-white"
            >
              Oke, Ngerti
            </button>
          </div>
        </div>
      )}
    </>
  );
}
