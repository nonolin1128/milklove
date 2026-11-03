/* ═══════════════════════════════════════════════════════════
   sw.js ── 離線用的 Service Worker
   放在根目錄，才管得到整個網站

   網頁、樣式、程式：先拿最新版，3 秒沒回應或斷網就用副本
   照片、圖示：先用副本，省流量

   ⚠ 新增或改名圖片：要同步更新 PRECACHE
   ⚠ 同檔名換圖：照片是先用副本，要把 CACHE 的版本號 +1 才會更新
   ═══════════════════════════════════════════════════════════ */

const CACHE = "milklove-v1";
const NETWORK_TIMEOUT = 3000;
const SLOW_PERIOD = 30000;

/* 一次超時後的這段時間直接用副本，不然每個檔案各等 3 秒，整頁要等十幾秒 */
let slowUntil = 0;

const PRECACHE = [
  "./",
  "index.html",
  "404.html",
  "manifest.webmanifest",
  "css/theme.css",
  "css/base.css",
  "css/layout.css",
  "css/components.css",
  "js/app.js",
  "js/config.js",
  "js/render.js",
  "js/trip.js",
  "js/util.js",
  "images/day1.webp",
  "images/day2.webp",
  "images/day3.webp",
  "images/day4.webp",
  "images/day5.webp",
  "images/pansa.webp",
  "images/love.webp",
  "images/muvmuv-head.webp",
  "images/icons/icon-180.png",
  "images/icons/icon-192.png",
  "images/icons/icon-512.png",
  "images/icons/icon-maskable-512.png",
];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE)
      .then((cache) => cache.addAll(PRECACHE))
      .then(() => self.skipWaiting())
  );
});

/* 清掉舊版本的副本，並立刻接管已經打開的頁面 */
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

async function saveCopy(request, response) {
  if (response.ok) {
    const cache = await caches.open(CACHE);
    await cache.put(request, response.clone());
  }
  return response;
}

async function cacheFirst(request) {
  return (await caches.match(request)) || saveCopy(request, await fetch(request));
}

async function networkFirst(request) {
  const network = fetch(request).then((response) => saveCopy(request, response));

  /* 網路很慢時不要乾等；背景的請求還在跑，下次打開就是新版 */
  const patience = Date.now() < slowUntil ? 0 : NETWORK_TIMEOUT;
  const timeout = new Promise((resolve) => setTimeout(() => resolve("timeout"), patience));
  const fast = await Promise.race([network.catch(() => null), timeout]);
  if (fast === "timeout") slowUntil = Date.now() + SLOW_PERIOD;
  else if (fast) return fast;

  const copy = await caches.match(request, { ignoreSearch: request.mode === "navigate" });
  if (copy) return copy;
  if (request.mode === "navigate") {
    const notFound = await caches.match("404.html");
    if (notFound) return notFound;
  }
  return network;
}

self.addEventListener("fetch", (e) => {
  const url = new URL(e.request.url);
  if (e.request.method !== "GET" || url.origin !== location.origin) return;

  const isImage = /\.(webp|png|jpe?g)$/i.test(url.pathname);
  e.respondWith(isImage ? cacheFirst(e.request) : networkFirst(e.request));
});
