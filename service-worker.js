const CACHE_NAME = 'charisma-loop-shell-v8';
const APP_SHELL = [
  './',
  './index.html',
  './web/prototype/index.html',
  './web/prototype/account.html',
  './web/prototype/order-tracking.html',
  './web/prototype/support.html',
  './web/prototype/impact-redeem.html',
  './web/prototype/menu-data.js',
  './web/prototype/nutrition-data.js',
  './web/prototype/ai-assistant.js',
  './ai-config.js',
  './manifest.webmanifest'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then(cached => cached || fetch(event.request))
  );
});
