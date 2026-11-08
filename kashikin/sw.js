const PREFIX = "kashikin-share-";
const CACHE = PREFIX + "404c4b8b97";
self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(["./"])).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  // 同一サイト内の他アプリのキャッシュには触れない(自分の旧版のみ削除)
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith(PREFIX) && k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  if (e.request.mode === "navigate") {
    e.respondWith(
      fetch(e.request).then(r => {
        const cp = r.clone();
        caches.open(CACHE).then(c => c.put("./", cp));
        return r;
      }).catch(() => caches.match("./"))
    );
  }
});
