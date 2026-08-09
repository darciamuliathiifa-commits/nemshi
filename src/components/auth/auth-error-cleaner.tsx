"use client";

import { useEffect } from "react";

export function AuthErrorCleaner() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const url = new URL(window.location.href);
    if (url.searchParams.has("error") || url.searchParams.has("error_code")) {
      url.searchParams.delete("error");
      url.searchParams.delete("error_code");
      url.searchParams.delete("error_description");
      const cleanUrl = url.pathname + (url.search ? url.search : "");
      window.history.replaceState({}, "", cleanUrl);
    }
  }, []);

  return null;
}
