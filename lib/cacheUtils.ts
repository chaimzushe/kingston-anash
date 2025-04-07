// Cache busting utility functions

// Generate a version string based on the current timestamp
// This will be used to append to static asset URLs to bust cache
export const getVersionString = (): string => {
  // Use the build time or current time as a version
  const buildTime = process.env.NEXT_PUBLIC_BUILD_TIME || Date.now().toString();
  return `v=${buildTime}`;
};

// Add version parameter to a URL to bust cache
export const addVersionToUrl = (url: string): string => {
  if (!url || typeof url !== 'string') return url;
  
  // Don't add version to external URLs or data URLs
  if (url.startsWith('http') || url.startsWith('data:')) return url;
  
  // Add version parameter
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}${getVersionString()}`;
};

// Add version parameter to an image src
export const versionedImage = (src: string): string => {
  return addVersionToUrl(src);
};
