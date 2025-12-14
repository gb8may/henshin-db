const CACHE_NAME = "henshin-db-v1";
const APP_SHELL = [
  "/",
  "/index.html",
  "/manifest.webmanifest",
  "/service-worker.js",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/icons/maskable-512.png"
];

// Instala e cacheia o “shell” do app
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

// Ativa e limpa caches antigos
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((k) => (k !== CACHE_NAME ? caches.delete(k) : null)))
    )
  );
  self.clients.claim();
});

// Helper: cache-first (assets)
async function cacheFirst(req) {
  const cached = await caches.match(req);
  if (cached) return cached;

  const res = await fetch(req);
  const cache = await caches.open(CACHE_NAME);
  cache.put(req, res.clone());
  return res;
}

// Helper: network-first (HTML/navigation)
async function networkFirst(req) {
  try {
    const res = await fetch(req);
    const cache = await caches.open(CACHE_NAME);
    // mantém o /index.html sempre atualizado pro fallback offline
    cache.put("/index.html", res.clone());
    return res;
  } catch {
    const cached = await caches.match("/index.html");
    return cached || new Response("Offline", { status: 503, statusText: "Offline" });
  }
}

// Estratégia: HTML = network-first (com fallback), assets = cache-first
self.addEventListener("fetch", (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // Só controla o mesmo domínio
  if (url.origin !== self.location.origin) return;

  // Navegação (documento)
  if (req.mode === "navigate") {
    event.respondWith(networkFirst(req));
    return;
  }

  // Demais assets
  event.respondWith(cacheFirst(req));
});
