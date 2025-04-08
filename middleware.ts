import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define public routes that don't require authentication
const publicRoutes = [
  '/',
  '/about',
  '/contact',
  '/minyanim',
  '/minyanim/(.*)', // Allow access to all minyanim pages
  '/community',
  '/community/(.*)',
  '/subscribe',
  '/auth/request-access',
  '/api/public/(.*)',
  '/api/auth/request-access',
  '/api/auth/validate-email',
  '/favicon.ico',
  '/images/(.*)',
];

// Create a custom middleware that handles authentication and redirects
export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Check if the path is public
  const isPublic = publicRoutes.some(route => {
    if (route.endsWith('(.*)')) {
      const baseRoute = route.replace('(.*)', '');
      return path.startsWith(baseRoute);
    }
    return path === route;
  });

  // For public routes, just add cache headers
  if (isPublic) {
    const response = NextResponse.next();
    response.headers.set('Cache-Control', 'no-store, max-age=0');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    return response;
  }

  // For protected routes, redirect to request-access if not authenticated
  // Note: In a real implementation, you would check for authentication here
  // For now, we'll just redirect all protected routes to request-access
  const requestAccessUrl = new URL('/auth/request-access', request.url);
  requestAccessUrl.searchParams.set('redirect_url', request.url);

  return NextResponse.redirect(requestAccessUrl);
}


// Run the middleware on all routes except static files and _next
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|images/).*)',
  ],
};
