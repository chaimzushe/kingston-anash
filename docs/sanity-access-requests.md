# Setting Up Access Requests in Sanity

This document explains how to set up the Access Request system in Sanity to work with the website's request form.

## Required Schema Types

### 1. Access Request Schema

You need to create an `accessRequest` document type in Sanity with the following fields:

- **name** (String): The requester's full name
- **email** (String): The requester's email address
- **phone** (String): The requester's phone number (optional)
- **message** (Text): Additional information from the requester (optional)
- **status** (String): The status of the request (pending, approved, rejected)
- **createdAt** (Datetime): When the request was submitted
- **processedAt** (Datetime): When the request was processed (optional)
- **processedBy** (Reference to user): Who processed the request (optional)

### 2. User Schema

You also need a `user` document type with at least these fields:

- **name** (String): User's full name
- **email** (String): User's email address
- **password** (String): Hashed password
- **isVerified** (Boolean): Whether the user is verified
- **role** (String): User's role (member, admin)

## Creating Schemas in Sanity Dashboard

1. Go to [https://www.sanity.io/manage](https://www.sanity.io/manage)
2. Select your project
3. Go to "Schema" in the left sidebar
4. Click "Create new type"
5. Choose "Document"
6. Fill in the details for each schema type

## API Token for Write Operations

The website needs a Sanity API token with write permissions to create access requests:

1. Go to [https://www.sanity.io/manage](https://www.sanity.io/manage)
2. Select your project
3. Go to "API" in the left sidebar
4. Click "Add API token"
5. Give it a name like "Website Write Token"
6. Set the permissions to "Editor"
7. Copy the token and add it to your `.env.local` file:

```
SANITY_API_TOKEN=your-api-token-here
```

## Testing the Access Request Form

After setting up the schema and API token:

1. Restart your development server
2. Go to the Request Access page
3. Fill out the form and submit
4. Check your Sanity Studio to see if the request was created

## Managing Access Requests in Sanity Studio

In Sanity Studio, you can:

1. View all access requests
2. Change their status (pending, approved, rejected)
3. Create user accounts for approved requests

## Troubleshooting

If you're getting a 500 error when submitting the form, check:

1. The API token is correct and has write permissions
2. The `accessRequest` schema exists in your Sanity project
3. The schema fields match what the API is trying to create
4. The API token is properly set in your environment variables
