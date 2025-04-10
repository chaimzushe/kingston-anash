import { NextRequest, NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';

export async function GET(request: NextRequest) {
  try {
    // Get the current authenticated user
    const user = await currentUser();

    if (!user) {
      return NextResponse.json(
        {
          authorized: false,
          status: 'unauthorized',
          message: 'Not authenticated'
        },
        { status: 401 }
      );
    }

    // User is authenticated, so they are authorized
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
