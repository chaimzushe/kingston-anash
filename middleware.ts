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
  '/auth/signin',
  '/api/public/(.*)',
  '/api/auth/request-access',
  '/api/auth/validate-email',
  '/api/auth/verify-user',
  '/favicon.ico',
  '/images/(.*)',
];

// Create a function to check if a route is public
function isPublicRoute(path: string): boolean {
  return publicRoutes.some(route => {
    if (route.endsWith('(.*)')) {
      const baseRoute = route.replace('(.*)', '');
      return path.startsWith(baseRoute);
    }
    return path === route;
  });
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
  // This is a simplified version that doesn't use Clerk's middleware
  // You can add your own authentication logic here
  
  // For now, we'll just allow all requests to proceed
  return NextResponse.next();
}

// Run the middleware on all routes except static files and _next
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|images/).*)',
  ],
};
