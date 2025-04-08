import { NextRequest, NextResponse } from 'next/server';
import { sanityClient } from '@/lib/sanity';

export async function GET(request: NextRequest) {
  try {
    const token = request.nextUrl.searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { message: 'Token is required' },
        { status: 400 }
      );
    }

    // Find the reset token in Sanity
    const resetToken = await sanityClient.fetch(
      `*[_type == "passwordReset" && token == $tokenParam && used == false && dateTime(expiresAt) > dateTime(now())][0]{
        _id,
        user->{
          _id,
          name,
          email
        },
        expiresAt
      }`,
      { tokenParam: token }
    );

    if (!resetToken) {
      return NextResponse.json(
        { message: 'Invalid or expired token' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      message: 'Token is valid',
      userId: resetToken.user._id,
      expiresAt: resetToken.expiresAt,
    });
  } catch (error) {
    console.error('Validate reset token error:', error);
    return NextResponse.json(
      { message: 'An error occurred while validating the token' },
      { status: 500 }
    );
  }
}
