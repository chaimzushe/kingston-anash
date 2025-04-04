# Subscription Troubleshooting Guide

This guide helps you troubleshoot issues with email and push notification subscriptions.

## Common Issues and Solutions

### 500 Error When Subscribing

If you're getting a 500 error when trying to subscribe via email or push notifications, here are the most common causes and solutions:

#### 1. Missing Sanity API Token

**Problem**: The application needs write access to Sanity to create subscription records.

**Solution**:
1. Create a Sanity API token with write permissions:
   - Go to [manage.sanity.io](https://manage.sanity.io/)
   - Select your project
   - Go to API > Tokens
   - Click "Add API token"
   - Name it (e.g., "Website Subscriptions")
   - Set permissions to "Editor" or at least "Write" access
   - Copy the token
2. Add the token to your `.env.local` file:
   ```
   SANITY_API_TOKEN=your-token-here
   ```
3. Restart your development server

#### 2. Missing Sanity Schemas

**Problem**: The subscription or pushSubscription schema might not be properly deployed to your Sanity studio.

**Solution**:
1. Make sure the schema files exist in your Sanity studio:
   - `subscription.js`
   - `pushSubscription.js`
2. Make sure they're included in your schema index file
3. Deploy your Sanity studio:
   ```bash
   cd cms
   npx sanity deploy
   ```

#### 3. CORS Issues

**Problem**: Your frontend domain might not be allowed to make API calls to Sanity.

**Solution**:
1. Add your domain to Sanity's CORS origins:
   ```bash
   npx sanity cors add http://localhost:3000 --credentials
   ```
2. For production:
   ```bash
   npx sanity cors add https://your-domain.com --credentials
   ```

#### 4. Network or Console Errors

**Problem**: There might be specific errors in your browser's console or network tab.

**Solution**:
1. Open your browser's developer tools (F12 or right-click > Inspect)
2. Go to the Console tab to check for JavaScript errors
3. Go to the Network tab and look for the failing request
4. Check the response for more detailed error information

## Debugging Steps

If you're still having issues, follow these debugging steps:

### 1. Check Server Logs

Look at your server logs for detailed error messages:

```bash
npm run dev
```

### 2. Test API Routes Directly

Use a tool like Postman or curl to test the API routes directly:

```bash
curl -X POST http://localhost:3000/api/subscribe \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "categories": ["category-id-1"]}'
```

### 3. Verify Sanity Connection

Make sure your application can connect to Sanity:

```bash
curl -X GET "https://{projectId}.api.sanity.io/v{apiVersion}/data/query/{dataset}?query=*[_type==\"subscription\"][0..10]" \
  -H "Authorization: Bearer {token}"
```

Replace `{projectId}`, `{apiVersion}`, `{dataset}`, and `{token}` with your values.

### 4. Check Schema Validation

Make sure your data matches the schema requirements:

1. Email must be a valid email format
2. Categories must be an array of valid category IDs
3. For push subscriptions, the subscription object must have the correct format

## Advanced Troubleshooting

If basic troubleshooting doesn't resolve the issue:

### 1. Create a Minimal Test Case

Create a simple API route that just tries to write to Sanity:

```typescript
// app/api/test-sanity/route.ts
import { NextResponse } from 'next/server';
import { sanityWriteClient } from '@/lib/sanity';

export async function GET() {
  try {
    const result = await sanityWriteClient.create({
      _type: 'test',
      title: 'Test Document',
      createdAt: new Date().toISOString()
    });
    
    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error('Test error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}
```

### 2. Check Sanity Permissions

Make sure your API token has the correct permissions:

1. Go to [manage.sanity.io](https://manage.sanity.io/)
2. Select your project
3. Go to API > Tokens
4. Check the permissions for your token
5. If needed, create a new token with Editor permissions

### 3. Check for Rate Limiting

Sanity has rate limits that might affect your application:

- Check if you're making too many requests in a short period
- Add error handling for rate limiting (HTTP 429 responses)
- Implement request throttling if necessary

## Getting Help

If you're still having issues:

1. Check the [Sanity documentation](https://www.sanity.io/docs)
2. Ask for help in the [Sanity community Slack](https://slack.sanity.io/)
3. File an issue in your project repository
