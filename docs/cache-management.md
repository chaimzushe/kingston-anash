# Cache Management Guide

This document explains how cache management works in the Kingston Anash website and how to troubleshoot cache-related issues.

## Cache Busting Mechanisms

The website implements several cache busting mechanisms to ensure users always see the latest content:

### 1. Build ID Generation

- A unique build ID is generated during each build process
- This ID is stored as an environment variable (`NEXT_PUBLIC_BUILD_TIME`)
- The build ID is used to version static assets

### 2. Cache Control Headers

- The middleware adds cache control headers to all responses
- These headers tell browsers and CDNs not to cache content
- Headers include `Cache-Control: no-store, max-age=0`

### 3. Service Worker Cache Management

- The service worker is versioned with a timestamp
- On activation, it clears all caches
- It checks for updates every minute

### 4. Cache Busting Components

- `CacheBustedImage`: A wrapper around Next.js Image that adds version parameters
- `CacheBuster`: A component that detects new versions and prompts users to refresh

## Troubleshooting Cache Issues

If you're still experiencing cache issues after deployment, try these steps:

### For End Users

1. **Hard Refresh**: Press Ctrl+F5 (Windows) or Cmd+Shift+R (Mac)
2. **Clear Browser Cache**: 
   - Chrome: Settings > Privacy and security > Clear browsing data
   - Firefox: Options > Privacy & Security > Cookies and Site Data > Clear Data
   - Safari: Preferences > Advanced > Show Develop menu > Develop > Empty Caches

3. **Check for Update Notification**: Look for the "New version available!" notification

### For Developers

1. **Force Service Worker Update**:
   ```javascript
   if ('serviceWorker' in navigator) {
     navigator.serviceWorker.getRegistrations().then(function(registrations) {
       for (let registration of registrations) {
         registration.unregister();
       }
     });
   }
   ```

2. **Verify Build ID Generation**:
   - Check that the build ID is being generated correctly
   - Verify that it's included in the environment variables

3. **Check Cache Headers**:
   - Use browser dev tools to inspect response headers
   - Verify that `Cache-Control: no-store` is present

4. **CDN Cache Purging**:
   - If using Vercel, purge the cache from the dashboard
   - If using Netlify, trigger a cache clear from the dashboard

## Implementing Cache Busting for New Features

When adding new features that might be affected by caching:

1. **Static Assets**: Use the `versionedImage` utility for images
2. **API Endpoints**: Add cache control headers
3. **Client-Side Data**: Add timestamp parameters to fetch requests

## Deployment Best Practices

To minimize cache issues during deployment:

1. **Incremental Static Regeneration**: Use ISR for pages that change frequently
2. **Staggered Deployments**: Deploy backend changes before frontend changes
3. **Version Tracking**: Include visible version numbers in the UI for debugging
