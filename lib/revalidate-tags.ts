// Define tags for different content types
export const EVENTS_TAG = 'events';
export const POSTS_TAG = 'posts';

// Map of content types to their respective paths for revalidation
export const CONTENT_PATHS = {
  [EVENTS_TAG]: [
    '/community/events',
    '/api/community/events',
    '/profile'
  ],
  [POSTS_TAG]: [
    '/blog',
    '/api/blog/posts'
  ],
};
