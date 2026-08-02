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

// Fetch event: network-first for HTML/CSS/JS/JSON, cache-first for everything else
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Network-first for HTML, CSS, JS, JSON (always check for updates first)
  if (url.pathname.endsWith('.html') || 
      url.pathname.endsWith('.js') ||
      url.pathname.endsWith('.css') ||
      url.pathname.endsWith('.json')) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Don't cache error responses
          if (!response || response.status !== 200 || response.type === 'error') {
            return response;
          }
          // Update cache with fresh version
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
          return response;
        })
        .catch(() => {
          // If network fails, fall back to cache
          return caches.match(event.request).then((response) => {
            return response || new Response('Offline — cached HTML unavailable', {
              status: 503,
              statusText: 'Service Unavailable'
            });
          });
        })
    );
  }
  // Network-first for API calls (live data feeds)
  else if (url.hostname === 'api.weather.gov' ||
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
          // Cache successful responses
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
  // Cache-first for everything else (images, fonts, external resources)
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