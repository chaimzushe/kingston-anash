# Setting Up Post Notifications

This document explains how to set up the notification system for new posts.

## Sanity Webhook Setup

To automatically send notifications when a new post is published, you need to set up a webhook in Sanity:

1. Go to [manage.sanity.io](https://manage.sanity.io/)
2. Select your project
3. Go to API > Webhooks
4. Click "Create webhook"
5. Fill in the following details:
   - Name: Post Notifications
   - URL: `https://your-site-url.com/api/notify`
   - Dataset: production
   - Filter: `_type == "post" && !(_id in path('drafts.**'))`
   - Projection: `{ "postId": _id }`
   - HTTP method: POST
   - Secret: (Generate a random string and save it as SANITY_WEBHOOK_SECRET in your environment variables)
   - Enable the webhook

## Email Service Setup

To send notification emails, you need to set up an email service:

1. Sign up for an email service like SendGrid, Mailgun, or Amazon SES
2. Get your API key
3. Add the API key to your environment variables
4. Update the `notify` API route to use your email service

Example code for SendGrid:

```typescript
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// In your notification function
await sgMail.send({
  to: subscriber.email,
  from: 'notifications@yourdomain.com',
  subject: `New Post: ${post.title}`,
  html: `
    <h1>New Post in Your Subscribed Categories</h1>
    <p>A new post titled "${post.title}" has been published.</p>
    <p><a href="${process.env.NEXT_PUBLIC_SITE_URL}/blog/${post.slug.current}">Read the post</a></p>
    <p>
      <a href="${process.env.NEXT_PUBLIC_SITE_URL}/unsubscribe/${subscriber.confirmationToken}">
        Unsubscribe from notifications
      </a>
    </p>
  `
});
```

## Environment Variables

Add the following environment variables to your project:

```
SENDGRID_API_KEY=your_sendgrid_api_key
NEXT_PUBLIC_SITE_URL=https://your-site-url.com
SANITY_WEBHOOK_SECRET=your_webhook_secret
```

## Testing the Notification System

To test the notification system:

1. Create a test subscription in Sanity Studio
2. Publish a new post with categories matching the subscription
3. Check the logs to see if the notification was triggered
4. Check your email to see if you received the notification
