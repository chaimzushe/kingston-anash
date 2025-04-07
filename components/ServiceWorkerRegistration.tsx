"use client";

import { useEffect } from 'react';

export default function ServiceWorkerRegistration() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      // Add a timestamp to force service worker update
      const swUrl = `/sw.js?v=${Date.now()}`;

      const registerSW = async () => {
        try {
          // Check if there's an existing registration
          const existingRegistration = await navigator.serviceWorker.getRegistration();

          if (existingRegistration) {
            console.log('Updating existing service worker');
            // Force update by unregistering and registering again
            await existingRegistration.unregister();
          }

          // Register the new service worker
          const registration = await navigator.serviceWorker.register(swUrl, {
            updateViaCache: 'none'
          });

          console.log('Service Worker registration successful with scope:', registration.scope);

          // Check for updates every minute
          setInterval(() => {
            registration.update();
            console.log('Checking for Service Worker updates...');
          }, 60000);
        } catch (error) {
          console.error('Service Worker registration failed:', error);
        }
      };

      // Register when the page loads
      window.addEventListener('load', registerSW);

      // Also try to register immediately
      registerSW();
    }
  }, []);

  return null;
}
