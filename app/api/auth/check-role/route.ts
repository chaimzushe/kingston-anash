import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

export async function GET(request: NextRequest) {
  try {
    // Get the current authenticated user
    const auth_session = await auth();
    const userId = auth_session.userId;

    if (!userId) {
      return NextResponse.json(
        {
          authorized: false,
          status: 'unauthorized',
          message: 'Not authenticated'
        },
        { status: 401 }
      );
    }

    // For now, assume the user is authorized
    // In a real application, you would check the user's role in Clerk
    return NextResponse.json({
      authorized: true,
      status: 'approved',
      message: 'User is authenticated'
    });
  } catch (error) {
    console.error('Error checking authentication:', error);
    return NextResponse.json(
      {
        authorized: false,
        status: 'error',
        message: 'Failed to verify authentication'
      },
      { status: 500 }
    );
  }
}
