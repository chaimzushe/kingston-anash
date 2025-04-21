import { createClient } from '@sanity/client';

// Create a direct client to Sanity
export const directSanityClient = createClient({
  // Use a public dataset that doesn't require authentication
  projectId: '3do82whm', // Public Movies dataset
  dataset: 'production',
  apiVersion: '2023-05-03',
  useCdn: false, // Set to false for real-time data
  // No token needed for public datasets
  // No CORS or authentication settings needed for public datasets
});

// Function to test the connection
export async function testSanityConnection() {
  try {
    // Use a query that works with the public movies dataset
    const result = await directSanityClient.fetch(`*[_type == "movie"][0...5]`);
    return {
      success: true,
      result,
    };
  } catch (error) {
    console.error('Error testing direct Sanity connection:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}
