"use client";

import { useEffect } from "react";

export function LandingMotion() {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>("[data-landing-root]");
    if (!root) return;

    const targets = root.querySelectorAll<HTMLElement>("[data-reveal]");
    targets.forEach((target) => {
      if (target.getBoundingClientRect().top < window.innerHeight * 0.95) {
        target.dataset.visible = "true";
      }
    });
    root.dataset.motionReady = "true";

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      targets.forEach((target) => {
        target.dataset.visible = "true";
      });
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          (entry.target as HTMLElement).dataset.visible = "true";
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -12%", threshold: 0.12 },
    );

    targets.forEach((target) => observer.observe(target));
    const fallback = window.setTimeout(() => {
      targets.forEach((target) => {
        target.dataset.visible = "true";
      });
    }, 1400);

    return () => {
      window.clearTimeout(fallback);
      observer.disconnect();
    };
  }, []);

  return null;
}
