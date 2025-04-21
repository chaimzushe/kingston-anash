import { createClient } from 'next-sanity';
import imageUrlBuilder from '@sanity/image-url';

// Define a constant for the revalidation time (60 seconds)
export const SANITY_REVALIDATE_TIME = 60; // seconds

// Sanity configuration
export const config = {
  dataset: 'production',
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'yvp1jx5r', // Kingston Anash project
  apiVersion: '2023-05-03', // Use a stable API version
  // Always disable CDN to get fresh content
  useCdn: false,
  // Add token to configuration if available
  token: process.env.SANITY_API_TOKEN,
  // Disable CORS origin check
  cors: true,
  // Disable authentication check
  withCredentials: false,
};

console.log('Using Sanity project ID:', config.projectId);

// Client for fetching data (read-only)
export const sanityClient = createClient(config);

// Client for mutations (with token for write operations)
export const sanityWriteClient = createClient(config);

// Helper function for generating image URLs with the Sanity Image Pipeline
const builder = imageUrlBuilder(sanityClient);

export function urlFor(source: any) {
  return builder.image(source);
}

// Helper function to create a GROQ query for community events
export function createEventsQuery(filters: string = '') {
  return `*[_type == "communityEvent"${filters ? ' && ' + filters : ''}] | order(date desc, startTime asc) {
    _id,
    title,
    description,
    date,
    startTime,
    endTime,
    duration,
    location,
    gender,
    creator,
    createdAt
  }`;
}

// Helper function to revalidate paths after content changes
export async function revalidatePaths(paths: string[]) {
  if (typeof window === 'undefined') {
    // Server-side only
    try {
      const { revalidatePath } = await import('next/cache');
      paths.forEach(path => {
        console.log(`Revalidating path: ${path}`);
        revalidatePath(path);
      });
      return true;
    } catch (error) {
      console.error('Error revalidating paths:', error);
      return false;
    }
  }
  return false;
}
