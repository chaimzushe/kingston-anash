# Managing Content with Sanity's Web Interface

This guide explains how to manage your content using Sanity's web interface without needing to maintain a local schema.

## Accessing Sanity Studio

You can access your Sanity Studio at:
```
https://web-content.sanity.studio/
```

This is where you'll manage all your content, including blog posts, users, and access requests.

## Managing Schemas in the Web Interface

Instead of maintaining schemas locally and deploying them, you can create and edit schemas directly in Sanity's web interface:

1. Go to [https://www.sanity.io/manage](https://www.sanity.io/manage)
2. Select your project
3. Go to "Schema" in the left sidebar
4. Here you can create, edit, and delete schema types

### Creating a New Schema Type

1. Click "Create new type"
2. Choose between Document, Object, or Primitive
3. Define your fields
4. Save the schema

### Editing an Existing Schema

1. Find the schema type you want to edit
2. Click on it to open the editor
3. Make your changes
4. Save the schema

## Managing Content

Once your schemas are set up, you can manage content in Sanity Studio:

1. Go to your Sanity Studio
2. Use the navigation to find the content type you want to manage
3. Create, edit, or delete content as needed

## Managing Users and Access Requests

### Viewing Access Requests

1. Go to your Sanity Studio
2. Click on "Access Requests" in the left sidebar
3. View all pending access requests

### Approving Access Requests

1. Click on the access request you want to approve
2. Change the status to "Approved"
3. Save the changes

### Creating User Accounts

1. Go to the "Users" section
2. Click "Create new"
3. Fill in the user details
4. Set "Is Verified" to true for immediate access
5. Save the user

## API Tokens and Webhooks

You can manage API tokens and webhooks through the Sanity management interface:

1. Go to [https://www.sanity.io/manage](https://www.sanity.io/manage)
2. Select your project
3. Go to "API" in the left sidebar
4. Here you can manage tokens and webhooks

### Creating an API Token

1. Click "Add API token"
2. Give it a descriptive name
3. Set the appropriate permissions
4. Copy the token and store it securely

### Setting Up Webhooks

1. Click "Create webhook"
2. Configure the webhook settings
3. Set the filter to trigger on specific events
4. Save the webhook

## Connecting Your Website to Sanity

Your website connects to Sanity using the client configuration in `lib/sanity.ts`. Make sure it has the correct project ID and dataset:

```typescript
export const config = {
  projectId: 'your-project-id',
  dataset: 'production',
  apiVersion: '2023-05-03',
  useCdn: true,
};
```

For write operations, you'll need an API token in your environment variables:

```
SANITY_API_TOKEN=your-api-token
```

## Benefits of This Approach

- No need to maintain local schema files
- No deployment steps required
- Changes are immediately available
- Easier collaboration with team members
- Built-in version control for content

## Limitations

- Less integration with your development workflow
- Can't use version control (like Git) for schema changes
- Limited customization of the Studio interface

This approach is ideal if you prefer a simpler workflow and don't need extensive customization of your Sanity Studio.
