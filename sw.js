// Network-first: always loads the newest version when online; falls back to the saved copy offline.
// The apps themselves load live from Google every time, so nothing on a device ever needs updating.
const CACHE = 'ec-team-shell';
const SHELL = ['/', '/manifest.webmanifest', '/icons/icon-192.png', '/icons/favicon.png'];
self.addEventListener('install', e => { self.skipWaiting(); e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).catch(() => {})); });
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== location.origin) return;
  e.respondWith(fetch(e.request).then(r => {
    const copy = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)).catch(() => {}); return r;
  }).catch(() => caches.match(e.request).then(r => r || caches.match('/'))));
});
