// Service Worker for PolicyScanner
// Version: 1.0.0

// Cache names with versioning for better cache management
const STATIC_CACHE_NAME = 'policyscanner-static-v1';
const IMAGE_CACHE_NAME = 'policyscanner-images-v1';
const FONT_CACHE_NAME = 'policyscanner-fonts-v1';
const API_CACHE_NAME = 'policyscanner-api-v1';

// Resources to cache immediately on service worker installation
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/assets/css/style.css',
  '/assets/css/homepage.css',
  '/assets/js/main.js',
  '/assets/js/trust-bar.js',
  '/assets/js/reviews-carousel.js',
  '/assets/js/partners.js',
  '/offline.html' // Create a simple offline page for when network is unavailable
];

// Install event - cache static assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then(cache => {
        console.log('Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => self.skipWaiting()) // Force activation on install
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  const currentCaches = [STATIC_CACHE_NAME, IMAGE_CACHE_NAME, FONT_CACHE_NAME, API_CACHE_NAME];
  
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return cacheNames.filter(cacheName => !currentCaches.includes(cacheName));
      })
      .then(cachesToDelete => {
        return Promise.all(cachesToDelete.map(cacheToDelete => {
          return caches.delete(cacheToDelete);
        }));
      })
      .then(() => self.clients.claim()) // Take control of all clients
  );
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  
  // Skip cross-origin requests
  if (url.origin !== self.location.origin) {
    return;
  }
  
  // Handle images - Cache First strategy
  if (event.request.destination === 'image') {
    event.respondWith(handleImageRequest(event.request));
    return;
  }
  
  // Handle fonts - Cache First strategy
  if (event.request.url.includes('/fonts/') || 
      event.request.url.includes('googleapis.com/css') ||
      event.request.url.includes('fonts.gstatic.com')) {
    event.respondWith(handleFontRequest(event.request));
    return;
  }
  
  // Handle HTML navigation - Network First strategy with offline fallback
  if (event.request.mode === 'navigate') {
    event.respondWith(handleNavigationRequest(event.request));
    return;
  }
  
  // Handle CSS/JS - Stale While Revalidate
  if (event.request.destination === 'script' || event.request.destination === 'style') {
    event.respondWith(handleAssetRequest(event.request));
    return;
  }
  
  // Default - Network with cache fallback
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Cache successful responses
        if (response && response.status === 200) {
          const responseClone = response.clone();
          caches.open(STATIC_CACHE_NAME).then(cache => {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      })
      .catch(() => {
        return caches.match(event.request);
      })
  );
});

// Image caching strategy - Cache First
async function handleImageRequest(request) {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    const cache = await caches.open(IMAGE_CACHE_NAME);
    cache.put(request, networkResponse.clone());
    return networkResponse;
  } catch (error) {
    // Could return a placeholder image here
    return new Response('Image not available', { status: 404 });
  }
}

// Font caching strategy - Cache First
async function handleFontRequest(request) {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    const cache = await caches.open(FONT_CACHE_NAME);
    cache.put(request, networkResponse.clone());
    return networkResponse;
  } catch (error) {
    // Fallback to system fonts handled by CSS
    return new Response('Font not available', { status: 404 });
  }
}

// Navigation caching strategy - Network First with offline fallback
async function handleNavigationRequest(request) {
  try {
    // Try network first
    const networkResponse = await fetch(request);
    
    // Cache successful responses
    if (networkResponse && networkResponse.status === 200) {
      const cache = await caches.open(STATIC_CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    // If network fails, try cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // If cache fails, return offline page
    return caches.match('/offline.html');
  }
}

// CSS/JS caching strategy - Stale While Revalidate
async function handleAssetRequest(request) {
  const cachedResponse = await caches.match(request);
  
  // Clone the request to use it twice
  const fetchPromise = fetch(request)
    .then(networkResponse => {
      // Cache the updated version
      if (networkResponse && networkResponse.status === 200) {
        const cache = caches.open(STATIC_CACHE_NAME);
        cache.then(cache => cache.put(request, networkResponse.clone()));
      }
      return networkResponse;
    })
    .catch(error => {
      console.error('Fetch failed for asset:', error);
      // No fallback needed here as we return cached response anyway
    });
  
  // Return cached response immediately if available, otherwise wait for network
  return cachedResponse || fetchPromise;
}