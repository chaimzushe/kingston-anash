import { NextRequest, NextResponse } from 'next/server';

/**
 * A simplified authentication utility that extracts the user ID from cookies or headers
 * This is a temporary solution until we can properly integrate Clerk authentication
 */
export async function requireAuth(request: NextRequest) {
  try {
    // For now, we'll use a hardcoded user ID for testing purposes
    // In a real application, you would extract this from a JWT token or session cookie
    const userId = 'user_2YQGdXQXJPnGXWzYCGwsHXYC9Xt';

    return {
      success: true,
      userId,
      user: { id: userId },
    };
  } catch (error) {
    console.error('Authentication error:', error);
    return {
      success: false,
      response: NextResponse.json(
        { error: 'Authentication failed', details: error instanceof Error ? error.message : 'Unknown error' },
        { status: 500 }
      ),
    };
  }
}
