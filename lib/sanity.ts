import { createClient } from 'next-sanity';
import imageUrlBuilder from '@sanity/image-url';

export const config = {
  dataset: 'production',
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'yvp1jx5r',
  apiVersion: '2023-05-03', // Use a stable API version
  useCdn: process.env.NODE_ENV === 'production',
};

export const sanityClient = createClient(config);

// Helper function for generating image URLs with the Sanity Image Pipeline
const builder = imageUrlBuilder(sanityClient);

export function urlFor(source: any) {
  return builder.image(source);
}
