/* Arcade Shelf service worker.
   The page registers this as "sw.js?v=<APP_VERSION>", so bumping APP_VERSION in index.html
   installs a fresh worker with its own cache and throws the old one away.
   App files are served network-first (always the latest when online, cached copy when offline). */
const VERSION = new URL(self.location.href).searchParams.get("v") || "dev";
const PREFIX = "arcade-shelf-";
const CACHE = PREFIX + VERSION;

self.addEventListener("install", e => {
  e.waitUntil((async () => {
    const c = await caches.open(CACHE);
    // one by one so a missing path never blocks the install
    await Promise.all(["./", "./index.html"].map(u => c.add(new Request(u, {cache: "reload"})).catch(() => {})));
    await self.skipWaiting();
  })());
});

self.addEventListener("activate", e => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k.startsWith(PREFIX) && k !== CACHE).map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET" || new URL(req.url).origin !== self.location.origin) return; // covers, fonts: untouched
  e.respondWith((async () => {
    try {
      const res = await fetch(req.url, {cache: "no-cache", credentials: "same-origin"});
      if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
      return res;
    } catch (err) {
      return (await caches.match(req, {ignoreSearch: true}))
          || (req.mode === "navigate" && (await caches.match("./index.html") || await caches.match("./")))
          || Response.error();
    }
  })());
});
