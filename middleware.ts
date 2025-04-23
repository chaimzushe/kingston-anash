import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { clerkMiddleware, auth } from '@clerk/nextjs/server';

// Define protected routes that require authentication
const PROTECTED_ROUTES = [
  '/community/directory',
  '/community/events',
  '/community/ride-share',
  '/community/giveaways',
  '/community/lashon-horo',
  '/profile',
  '/api/community/members',
  '/api/community/events/create',
  '/api/community/events/update',
  '/api/community/events/delete',
  '/api/community/events/user',
  '/api/community/giveaways/create',
  '/api/community/giveaways/update',
  '/api/community/giveaways/delete',
  '/api/upload',
  '/events',
];

// Apply Clerk middleware
const clerkMiddlewareInstance = clerkMiddleware();

// Export the Clerk middleware as the default middleware
export default clerkMiddlewareInstance;

// Add our custom middleware for cache control
export function middleware(request: NextRequest) {
  // Clone the response
  const response = NextResponse.next();

  // Add cache control headers to prevent aggressive caching
  response.headers.set('Cache-Control', 'no-store, max-age=0');
  response.headers.set('Pragma', 'no-cache');
  response.headers.set('Expires', '0');

  return response;
}

// Configure the middleware to run on specific routes
export const config = {
  matcher: [
    // Match all protected routes
    '/community/:path*',
    '/profile/:path*',
    '/events/:path*',
    '/api/community/:path*',

    // Exclude static files, assets, and specific routes
    '/((?!_next/static|_next/image|favicon.ico|images/|auth/signin|auth/signin/.*|auth/signin/sso-callback).*)',
  ],
};
