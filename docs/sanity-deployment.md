# Deploying Sanity Studio and Managing Access Requests

This document explains how to deploy your Sanity Studio and manage access requests for the Kingston Anash website.

## Deploying Sanity Studio

To make your schema changes visible in Sanity Studio, you need to deploy the studio:

```bash
npm run deploy-cms
```

This will deploy your Sanity Studio to a public URL where you can manage your content.

## Deploying Schema Changes

If you've made changes to the schema (like adding the `accessRequest` type) and don't see them in your Sanity Studio, you need to deploy the schema changes:

```bash
npm run deploy-schema
```

This will update your Sanity Studio with the latest schema changes.

## Viewing Access Requests

After deploying your schema, you should be able to see access requests in Sanity Studio:

1. Go to your Sanity Studio (https://web-content.sanity.studio/ or your custom domain)
2. Log in with your Sanity account
3. You should see "Access Requests" in the left sidebar
4. Click on it to view all access requests

If you don't see "Access Requests" in the sidebar:

1. Make sure you've deployed your schema changes
2. Try refreshing the page
3. Log out and log back in

## Approving Access Requests

To approve an access request and create a user account:

1. Go to the "Access Requests" section in Sanity Studio
2. Click on the request you want to approve
3. Change the status to "Approved"
4. Add any notes if needed
5. Save the changes
6. Go to the "Users" section
7. Click "Create new"
8. Fill in the user details (use the information from the access request)
9. Set "Is Verified" to true
10. Save the user

## Testing Locally

When testing locally, access requests might not show up in your Sanity Studio because:

1. Your local server might not have write access to your Sanity project
2. You might not have deployed your schema changes
3. The API token might not have the correct permissions

To fix this:

1. Make sure you have a valid Sanity API token with write permissions
2. Add the token to your `.env.local` file:
   ```
   SANITY_API_TOKEN=your-token-here
   ```
3. Deploy your schema changes
4. Restart your development server

## Troubleshooting

If you're still having issues:

1. Check the browser console for errors
2. Check your server logs for errors
3. Make sure your Sanity project ID and dataset are correct
4. Verify that your API token has the correct permissions
5. Try creating an access request directly in Sanity Studio to test
