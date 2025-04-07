// Service Worker for Push Notifications

self.addEventListener('push', function(event) {
  if (event.data) {
    const data = event.data.json();

    const options = {
      body: data.body,
      icon: '/icons/icon-192x192.png',
      badge: '/icons/badge-72x72.png',
      data: {
        url: data.url
      },
      actions: [
        {
          action: 'view',
          title: 'View'
        }
      ]
    };

    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();

  if (event.action === 'view' || event.action === '') {
    const urlToOpen = event.notification.data.url || '/';

    event.waitUntil(
      clients.openWindow(urlToOpen)
    );
  }
});

// Service worker installation and activation
self.addEventListener('install', (event) => {
  self.skipWaiting();
  console.log('Service Worker installed with version:', new Date().toISOString());
});

self.addEventListener('activate', (event) => {
  // Clear all caches on activation
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          console.log('Deleting cache:', cacheName);
          return caches.delete(cacheName);
        })
      );
    }).then(() => {
      console.log('All caches cleared, claiming clients');
      return self.clients.claim();
    })
  );
});
