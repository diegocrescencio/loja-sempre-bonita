const CACHE = "sempre-bonita-v5";

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then(cache => {
      return cache.addAll([
        "./",
        "./index.html"
      ]);
    })
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
});

self.addEventListener("fetch", (event) => {
  // Deixar requisições do Firebase passarem direto (sem cache)
  if (event.request.url.includes("firebase") ||
      event.request.url.includes("googleapis") ||
      event.request.url.includes("firestore")) {
    return;
  }
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
