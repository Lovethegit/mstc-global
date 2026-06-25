// MSTC GLOBAL Service Worker — cache-first shell strategy
const CACHE_NAME = "mstc-shell-v1";
const SHELL_ASSETS = [
  "/",
  "/index.html",
  "/manifest.json",
  "/assets/generated/mstc-logo.dim_400x400.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(SHELL_ASSETS)),
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)),
        ),
      ),
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  // Only handle GET requests
  if (request.method !== "GET") return;
  // Skip non-http(s) requests
  if (!request.url.startsWith("http")) return;

  // For navigation requests: network-first, fallback to /index.html for SPA
  if (request.mode === "navigate") {
    event.respondWith(fetch(request).catch(() => caches.match("/index.html")));
    return;
  }

  // For assets: cache-first
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request).then((response) => {
        if (!response || response.status !== 200) return response;
        const cloned = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(request, cloned));
        return response;
      });
    }),
  );
});
