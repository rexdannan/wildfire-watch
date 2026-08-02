const CACHE_NAME = 'wildfire-watch-v1';
const ASSETS_TO_CACHE = [
  '/wildfire-watch/wildfire-watch.html',
  '/wildfire-watch/manifest.json'
];

// Install event: cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Activate event: clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event: network-first for live data, cache-first for static assets
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Network-first for API calls (live data feeds)
  if (url.hostname === 'api.weather.gov' ||
      url.hostname === 'api.open-meteo.com' ||
      url.hostname === 'api.synopticdata.com' ||
      url.hostname === 'alerts.weather.gov' ||
      url.hostname === 'widget.airnow.gov' ||
      url.hostname === 'embed.windy.com') {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Don't cache error responses
          if (!response || response.status !== 200 || response.type === 'error') {
            return response;
          }
          // Cache successful responses, but don't slow down the return
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
          return response;
        })
        .catch(() => {
          // If network fails, try cache
          return caches.match(event.request).then((response) => {
            return response || new Response('Offline — cached data unavailable', {
              status: 503,
              statusText: 'Service Unavailable'
            });
          });
        })
    );
  }
  // Cache-first for static assets (HTML, CSS, JS)
  else if (url.pathname.endsWith('.html') || 
           url.pathname.endsWith('.js') ||
           url.pathname.endsWith('.css') ||
           url.pathname.endsWith('.json')) {
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request).then((response) => {
          // Cache new assets on first load
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
          return response;
        }).catch(() => {
          return new Response('Offline', { status: 503 });
        });
      })
    );
  }
  // For everything else (images, fonts, etc.), use cache-first
  else {
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request).catch(() => {
          return new Response('Offline', { status: 503 });
        });
      })
    );
  }
});