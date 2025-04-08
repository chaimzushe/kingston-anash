import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define public routes that don't require authentication
const publicRoutes = [
  '/',
  '/about',
  '/contact',
  '/minyanim',
  '/minyanim/(.*)', // Allow access to all minyanim pages
  '/community', // Only the main community page is public
  '/subscribe',
  '/auth/request-access',
  '/auth/signin',
  '/api/public/(.*)',
  '/api/auth/request-access',
  '/api/auth/validate-email',
  '/api/auth/verify-user',
  '/favicon.ico',
  '/images/(.*)',
];

// Define protected community routes that require authentication
const protectedCommunityRoutes = [
  '/community/events',
  '/community/directory',
  '/community/ride-share',
  '/community/giveaways',
  '/community/lashon-horo',
  '/profile',
  '/api/community/members',
];

// Create a function to check if a route is public
function isPublicRoute(path: string): boolean {
  // First check if the path is in the protected routes list
  for (const route of protectedCommunityRoutes) {
    if (path === route || path.startsWith(`${route}/`)) {
      console.log(`Protected route detected: ${path}`);
      return false;
    }
  }

  // Then check if it's in the public routes list
  for (const route of publicRoutes) {
    if (route.endsWith('(.*)')) {
      const baseRoute = route.replace('(.*)', '');
      if (path === baseRoute || path.startsWith(`${baseRoute}/`)) {
        console.log(`Public route detected: ${path}`);
        return true;
      }
    } else if (path === route) {
      console.log(`Public route detected: ${path}`);
      return true;
    }
  }

  // If not explicitly public, treat as protected
  console.log(`Default protected route: ${path}`);
  return false;
}

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // If the route is public, just add cache headers
  if (isPublicRoute(path)) {
    const response = NextResponse.next();
    response.headers.set('Cache-Control', 'no-store, max-age=0');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    return response;
  }

  // For protected routes, check if the user is authenticated
  // Check for Clerk's session token cookie
  const hasClerkSession = request.cookies.has('__session') ||
                         request.cookies.has('__clerk_db_jwt');

  // If no session cookie is found, redirect to sign-in
  if (!hasClerkSession) {
    console.log(`Redirecting unauthenticated user from ${path} to sign-in`);
    const signInUrl = new URL('/auth/signin', request.url);
    signInUrl.searchParams.set('redirect_url', request.url);
    return NextResponse.redirect(signInUrl);
  }

  // User has a session cookie, allow them to proceed
  console.log(`Authenticated user accessing ${path}`);
  return NextResponse.next();
}

// Run the middleware on all routes except static files and _next
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|images/).*)',
  ],
};
