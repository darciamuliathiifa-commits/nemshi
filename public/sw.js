self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

// No offline caching yet — this pass-through handler is just here so the
// browser's PWA installability check (which wants a registered service
// worker with a fetch handler) is satisfied.
self.addEventListener("fetch", () => {});
