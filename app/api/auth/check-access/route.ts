import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

export async function GET(request: NextRequest) {
  try {
    // Get the redirect URL from the query parameters
    const redirectUrl = request.nextUrl.searchParams.get('redirect_url') || '/';

    // Get the current authenticated user
    const auth_session = await auth();
    const userId = auth_session.userId;

    if (!userId) {
      // If no user is found, redirect to sign-in
      const signInUrl = new URL('/auth/signin', request.url);
      signInUrl.searchParams.set('redirect_url', redirectUrl);
      return NextResponse.redirect(signInUrl);
    }

    // For now, just redirect to the original URL
    // The role check will be done client-side in the protected pages
    return NextResponse.redirect(new URL(redirectUrl, request.url));
  } catch (error) {
    console.error('[API] Error checking authentication:', error);
    // If there's an error, redirect to sign-in as a fallback
    return NextResponse.redirect(new URL('/auth/signin', request.url));
  }
}
