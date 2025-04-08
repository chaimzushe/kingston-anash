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
  '/events', // Add the events redirect page
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

  // For protected routes, check for authentication
  const authCookie = request.cookies.get('__session') || request.cookies.get('__clerk_db_jwt');

  // If no auth cookie is found, redirect to sign-in
  if (!authCookie) {
    console.log(`[Middleware] Redirecting unauthenticated user from ${pathname} to sign-in`);
    const signInUrl = new URL('/auth/signin', request.url);
    signInUrl.searchParams.set('redirect_url', request.url);
    return NextResponse.redirect(signInUrl);
  }

  // User has an auth cookie, allow them to proceed
  console.log(`[Middleware] Authenticated user accessing ${pathname}`);
  return NextResponse.next();
}

// Configure the middleware to run on all routes except static files
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images/ (image files)
     */
    '/((?!_next/static|_next/image|favicon.ico|images/).*)',
  ],
};
