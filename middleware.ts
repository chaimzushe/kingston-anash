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

  // For protected routes, redirect to sign-in
  // We'll let the sign-in page handle the authentication check
  const signInUrl = new URL('/auth/signin', request.url);
  signInUrl.searchParams.set('redirect_url', request.url);
  return NextResponse.redirect(signInUrl);
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
