const CACHE = 'set3-v33';
// Relative paths (no leading slash) so this works whether the app is
// deployed at a domain root (Netlify/Cloudflare) or a subpath
// (GitHub Pages project sites, e.g. username.github.io/reponame/).
const SHELL = ['.', 'index.html', 'manifest.json', 'icons.js', 'store.js', 'exercises.js', 'coach.js', 'daily.js', 'app.js'];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(SHELL.map(p => new URL(p, self.registration.scope).href)))
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Network-first for the app shell (HTML/JS/manifest) so a stale cache can
// never "stick" even if the old service worker is still momentarily active.
// Falls back to cache only when offline. Everything else (icons) is cache-first.
// Resolved against self.registration.scope (the SW's own directory), not
// the bare origin, so this is correct under any subpath.
const SHELL_SET = new Set(SHELL.map(p => new URL(p, self.registration.scope).pathname));

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  const isShell = e.request.mode === 'navigate' || SHELL_SET.has(url.pathname);

  if (isShell) {
    e.respondWith(
      fetch(e.request)
        .then(res => {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, copy));
          return res;
        })
        .catch(() => caches.match(e.request))
    );
  } else {
    e.respondWith(
      caches.match(e.request).then(cached => cached || fetch(e.request))
    );
  }
});
