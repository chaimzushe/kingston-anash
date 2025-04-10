import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define protected routes that require authentication
const PROTECTED_ROUTES = [
  '/community/directory',
  '/community/events',
  '/community/ride-share',
  '/community/giveaways',
  '/community/lashon-horo',
  '/profile',
  '/api/community/members',
  '/events',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the current path is a protected route
  const isProtectedRoute = PROTECTED_ROUTES.some(route =>
    pathname === route || pathname.startsWith(`${route}/`)
  );

  // If it's not a protected route, allow the request to proceed
  if (!isProtectedRoute) {
    return NextResponse.next();
  }

  // Check for authentication cookie
  const hasAuthCookie = request.cookies.has('__session') || request.cookies.has('__clerk_db_jwt');

  // If no auth cookie is found, redirect to sign-in
  if (!hasAuthCookie) {
    console.log(`[Middleware] Redirecting unauthenticated user from ${pathname} to sign-in`);

    // Get the base URL (protocol + host)
    const baseUrl = request.nextUrl.origin;

    // Create the sign-in URL with the correct base URL
    const signInUrl = new URL('/auth/signin', baseUrl);

    // Add the current URL as a redirect parameter
    signInUrl.searchParams.set('redirect_url', request.url);

    return NextResponse.redirect(signInUrl);
  }

  // User has an auth cookie, allow them to proceed
  return NextResponse.next();
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
    '/((?!_next/static|_next/image|favicon.ico|images/|auth/signin/sso-callback).*)',
  ],
};
