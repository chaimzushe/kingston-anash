import { NextRequest, NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';

export async function GET(request: NextRequest) {
  try {
    // Get the redirect URL from the query parameters
    const redirectUrl = request.nextUrl.searchParams.get('redirect_url') || '/';

    // Get the current authenticated user
    const user = await currentUser();

    if (!user) {
      // If no user is found, redirect to sign-in
      const signInUrl = new URL('/auth/signin', request.url);
      signInUrl.searchParams.set('redirect_url', redirectUrl);
      return NextResponse.redirect(signInUrl);
    }

    // User is authenticated, redirect to the original URL
    return NextResponse.redirect(new URL(redirectUrl, request.url));
  } catch (error) {
    console.error('[API] Error checking authentication:', error);
    // If there's an error, redirect to sign-in as a fallback
    return NextResponse.redirect(new URL('/auth/signin', request.url));
  }
}
