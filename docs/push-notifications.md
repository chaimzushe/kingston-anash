# Push Notifications Setup

This document explains how to set up and manage push notifications for the Kingston Anash website.

## Overview

The push notification system allows users to subscribe to receive notifications when new posts are published in categories they're interested in. These notifications are delivered directly to their device, even when they're not actively browsing the website.

## Technical Implementation

The push notification system uses the following technologies:

- **Web Push API**: For sending push notifications to browsers
- **Service Worker**: For handling push events and displaying notifications
- **Sanity CMS**: For storing subscription data and managing content

## Setup Instructions

### 1. Generate VAPID Keys

In a production environment, you need to generate VAPID keys for Web Push:

```bash
npx web-push generate-vapid-keys
```

Update the `lib/push-notifications.ts` file with your generated keys:

```typescript
export const VAPID_PUBLIC_KEY = 'your-public-key';
export const VAPID_PRIVATE_KEY = 'your-private-key';
```

### 2. Install Required Packages

```bash
npm install web-push
```

### 3. Update the Send Notification Function

In `lib/push-notifications.ts`, update the `sendPushNotification` function to use the web-push library:

```typescript
import webpush from 'web-push';

webpush.setVapidDetails(
  'mailto:your-email@example.com',
  VAPID_PUBLIC_KEY,
  VAPID_PRIVATE_KEY
);

export async function sendPushNotification(subscription, payload) {
  return webpush.sendNotification(subscription, JSON.stringify(payload));
}
```

### 4. Create Icons for Notifications

Create and add the following icons to the `public/icons` directory:
- `icon-192x192.png`: For notification icons
- `icon-512x512.png`: For PWA icons
- `badge-72x72.png`: For notification badges

### 5. Set Up Webhook in Sanity

To automatically send push notifications when a new post is published:

1. Go to [manage.sanity.io](https://manage.sanity.io/)
2. Select your project
3. Go to API > Webhooks
4. Click "Create webhook"
5. Fill in the following details:
   - Name: Push Notifications
   - URL: `https://your-site-url.com/api/push/send`
   - Dataset: production
   - Filter: `_type == "post" && !(_id in path('drafts.**'))`
   - Projection: `{ "postId": _id }`
   - HTTP method: POST
   - Secret: (Generate a random string and save it as SANITY_WEBHOOK_SECRET in your environment variables)
   - Enable the webhook

## User Experience

### Subscribing to Push Notifications

1. Users visit the `/subscribe` page
2. They select categories they're interested in
3. They click "Subscribe to Notifications"
4. The browser requests permission to show notifications
5. Once granted, the user is subscribed

### Receiving Notifications

1. When a new post is published in a category the user is subscribed to:
   - The Sanity webhook triggers the `/api/push/send` endpoint
   - The server sends a push notification to all subscribed users
   - The notification appears on the user's device
   - Clicking the notification takes the user to the post

### Managing Subscriptions

Users can:
- Update their category preferences
- Unsubscribe from notifications entirely
- Re-subscribe at any time

## Testing Push Notifications

To test the push notification system:

1. Subscribe to push notifications on your development environment
2. Use the following curl command to simulate a webhook call:

```bash
curl -X POST http://localhost:3000/api/push/send \
  -H "Content-Type: application/json" \
  -d '{"postId": "your-test-post-id"}'
```

Replace `your-test-post-id` with the ID of a post in your Sanity dataset.

## Troubleshooting

- **Notifications not showing**: Check browser permissions and service worker registration
- **Service worker not registering**: Verify the service worker path and HTTPS requirements
- **Webhook not triggering**: Check Sanity webhook logs and filter conditions
