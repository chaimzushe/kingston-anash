// This script adds sample categories to your Sanity dataset
// Run it with: node scripts/add-sample-categories.js

// Import the Sanity client
const { createClient } = require('@sanity/client');
require('dotenv').config({ path: '.env.local' });

// Configure the client
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2023-05-03',
  token: process.env.SANITY_API_TOKEN, // Need a token with write access
  useCdn: false
});

// Sample categories
const sampleCategories = [
  {
    _type: 'category',
    title: 'Community',
    description: 'News and updates about our community'
  },
  {
    _type: 'category',
    title: 'Events',
    description: 'Upcoming and past events'
  },
  {
    _type: 'category',
    title: 'Minyanim',
    description: 'Updates about local minyanim'
  },
  {
    _type: 'category',
    title: 'Education',
    description: 'Educational content and resources'
  },
  {
    _type: 'category',
    title: 'Announcements',
    description: 'Important announcements for the community'
  }
];

// Function to add categories
async function addCategories() {
  try {
    console.log('Checking for existing categories...');
    const existingCategories = await client.fetch('*[_type == "category"].title');
    console.log(`Found ${existingCategories.length} existing categories`);

    // Filter out categories that already exist
    const categoriesToAdd = sampleCategories.filter(
      category => !existingCategories.includes(category.title)
    );

    if (categoriesToAdd.length === 0) {
      console.log('All sample categories already exist. No new categories added.');
      return;
    }

    console.log(`Adding ${categoriesToAdd.length} new categories...`);
    
    // Create transactions for each category
    const transaction = client.transaction();
    categoriesToAdd.forEach(category => {
      transaction.create(category);
    });

    // Commit the transaction
    const result = await transaction.commit();
    console.log(`Successfully added ${result.results.length} categories!`);
    console.log('New categories:');
    categoriesToAdd.forEach(category => {
      console.log(`- ${category.title}`);
    });
  } catch (error) {
    console.error('Error adding categories:', error);
    if (error.message.includes('permission')) {
      console.error('\nPermission error: Make sure you have a valid SANITY_API_TOKEN with write access in your .env.local file');
    }
  }
}

// Run the function
addCategories();
