# Adding Categories to Your Sanity CMS

This guide explains how to add categories to your Sanity CMS for use with the subscription and notification features.

## Why Categories Are Important

Categories are used to:
- Organize your content
- Allow users to subscribe to specific topics
- Send targeted notifications to interested users

## Option 1: Using the Sample Categories Script

We've created a script that adds sample categories to your Sanity dataset:

1. Make sure you have a valid Sanity API token with write permissions in your `.env.local` file:
   ```
   SANITY_API_TOKEN=your-token-here
   ```

2. Install the required dependencies:
   ```bash
   npm install @sanity/client dotenv
   ```

3. Run the script:
   ```bash
   npm run add-categories
   ```

This will add the following sample categories:
- Community
- Events
- Minyanim
- Education
- Announcements

## Option 2: Adding Categories Manually in Sanity Studio

You can also add categories directly in the Sanity Studio:

1. Go to your Sanity Studio (https://web-content.sanity.studio/ or your custom domain)
2. Log in with your Sanity account
3. Click on "Categories" in the left sidebar
4. Click the "Create new" button
5. Fill in the following fields:
   - **Title**: The name of the category (e.g., "Community")
   - **Description**: A brief description of the category (optional)
6. Click "Publish" to save the category

## Option 3: Using the Sanity CLI

You can also add categories using the Sanity CLI:

1. Make sure you have the Sanity CLI installed:
   ```bash
   npm install -g @sanity/cli
   ```

2. Log in to your Sanity account:
   ```bash
   sanity login
   ```

3. Create a new document:
   ```bash
   sanity documents create --type category --dataset production
   ```

4. Enter the document data when prompted (title and description)

## Verifying Categories

To check if your categories were added successfully:

1. Go to your Sanity Studio
2. Click on "Categories" in the left sidebar
3. You should see your categories listed

Alternatively, you can check via the API:

```bash
curl "https://<your-project-id>.api.sanity.io/v<api-version>/data/query/<dataset>?query=*[_type==\"category\"]"
```

Replace `<your-project-id>`, `<api-version>`, and `<dataset>` with your values.

## Using Categories in Your Application

Once you've added categories, they will automatically appear in:
- The subscription form
- The push notification form
- Category filters for blog posts

Users can now select which categories they're interested in and receive notifications only for those topics.
