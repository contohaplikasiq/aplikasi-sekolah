/* Service worker Aplikasi Sekolah v2.0.0 — © Arraihan Academy
   Jaringan lebih dulu; bila offline, tampilkan cangkang aplikasi dari cache. Permintaan ke server data tidak pernah di-cache. */
const CACHE = 'as-v2.0.0';
const SHELL = ['./', 'index.html', 'css/style.css', 'js/config.js', 'js/app.js', 'manifest.webmanifest', 'icon.svg'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const r = e.request; const u = new URL(r.url);
  if (r.method !== 'GET' || u.origin !== location.origin) return;
  e.respondWith(
    Promise.race([fetch(r), new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), 5000))])
      .then(res => { if (res && res.ok) { const cp = res.clone(); caches.open(CACHE).then(c => c.put(r, cp)); } return res; })
      .catch(() => caches.match(r).then(m => m || (r.mode === 'navigate' ? caches.match('index.html') : Response.error())))
  );
});
