'use strict';
const CACHE = 'mesa-shell-v1';
const SHELL = ['./', './index.html', './styles.css', './data.js', './app.js', './manifest.webmanifest', './icons/icon.svg', './icons/icon-192.png', './icons/icon-512.png', './icons/icon-maskable-512.png', './icons/apple-touch-icon.png'];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(SHELL)));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key.startsWith('mesa-shell-') && key !== CACHE).map(key => caches.delete(key)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  if (event.request.method !== 'GET' || url.origin !== self.location.origin) return;
  // External destinations and the custom app scheme are never cached or rewritten.
  if (event.request.mode === 'navigate') {
    event.respondWith(fetch(event.request).catch(() => caches.match(new URL('./index.html', self.registration.scope))));
    return;
  }
  if (!SHELL.some(path => new URL(path, self.registration.scope).href === url.href)) return;
  event.respondWith(caches.match(event.request).then(cached => cached || fetch(event.request)));
});
