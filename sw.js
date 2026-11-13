/* Arcade Shelf service worker.
   The page registers this as "sw.js?v=<APP_VERSION>", so bumping APP_VERSION in index.html
   installs a fresh worker with its own app cache and throws the old one away.

   - App files: precached at install, then served network-first (newest when online, cached copy when
     offline or when the network is too slow).
   - Box art and screenshots from thumbnails.libretro.com: cache-first in a separate cache that survives
     app updates. That server sends no CORS headers, so responses are opaque and a 404 can't be told
     apart here; the page deletes any cached entry that fails to load as an image. */
const VERSION = new URL(self.location.href).searchParams.get("v") || "dev";
const PREFIX = "arcade-shelf-";
const CACHE = PREFIX + VERSION;
const ART = "arcade-art-v1";          // deliberately not under PREFIX: kept across versions
const ART_ORIGIN = "https://thumbnails.libretro.com";
const NET_TIMEOUT = 3500;

/* Every file the app needs to run. Add new files here. */
const SHELL = [
  "./", "./index.html", "./img/icon.png",
  ...["nes","fds","snes","n64","gc","gb","gbc","gba","nds","vb","sms","md","dc","pce","ps1","arcade"].map(k => `./img/systems/${k}.svg`)
];

self.addEventListener("install", e => {
  e.waitUntil((async () => {
    const c = await caches.open(CACHE);
    // one by one so a single missing path never blocks the install
    await Promise.all(SHELL.map(u => c.add(new Request(u, {cache: "reload"})).catch(() => {})));
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
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin === ART_ORIGIN) e.respondWith(art(req));
  else if (url.origin === self.location.origin) e.respondWith(app(req));
});

async function art(req) {
  const c = await caches.open(ART);
  const hit = await c.match(req.url);
  if (hit) return hit;
  try {
    const res = await fetch(req.url, {mode: "no-cors", credentials: "omit"});
    if (res.ok || res.type === "opaque") c.put(req.url, res.clone()).catch(() => {});   // storage full: just don't keep it
    return res;
  } catch (err) {
    return Response.error();
  }
}

async function app(req) {
  const cached = () => caches.match(req, {ignoreSearch: true}).then(r =>
    r || (req.mode === "navigate" ? caches.match("./index.html").then(i => i || caches.match("./")) : undefined));
  const net = fetch(req.url, {cache: "no-cache", credentials: "same-origin"}).then(res => {
    if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
    return res;
  });
  net.catch(() => {});
  // a dead or very slow connection falls back to the cached copy instead of hanging
  const slow = new Promise(r => setTimeout(r, NET_TIMEOUT)).then(cached);
  try {
    const first = await Promise.race([net, slow]);
    if (first) return first;
    return await net;
  } catch (err) {
    return (await cached()) || Response.error();
  }
}
