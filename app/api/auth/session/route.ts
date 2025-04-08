import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { sanityClient } from '@/lib/sanity';

export async function GET(request: NextRequest) {
  try {
    // Get the session token from cookies
    const cookieStore =await cookies();
    const sessionToken = cookieStore.get('session_token')?.value;

    if (!sessionToken) {
      return NextResponse.json(
        { message: 'Not authenticated' },
        { status: 401 }
      );
    }

    // In a real application, you would validate the session token against a database
    // For now, we'll just return a mock user
    // This is where you would check if the session is valid and get the user data

    // Mock user data
    const user = {
      _id: 'user-123',
      name: 'Test User',
      email: 'test@example.com',
      role: 'member',
      isVerified: true,
    };

    return NextResponse.json({
      user,
    });
  } catch (error) {
    console.error('Session error:', error);
    return NextResponse.json(
      { message: 'An error occurred while getting session data' },
      { status: 500 }
    );
  }
}
