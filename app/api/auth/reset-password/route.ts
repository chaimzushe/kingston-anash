import { NextRequest, NextResponse } from 'next/server';
import { hash } from 'bcrypt';
import { sanityClient, sanityWriteClient } from '@/lib/sanity';

export async function POST(request: NextRequest) {
  try {
    const { token, password } = await request.json();

    // Validate input
    if (!token || !password) {
      return NextResponse.json(
        { message: 'Token and password are required' },
        { status: 400 }
      );
    }

    // Validate password length
    if (password.length < 8) {
      return NextResponse.json(
        { message: 'Password must be at least 8 characters long' },
        { status: 400 }
      );
    }

    // Find the reset token in Sanity
    const resetToken = await sanityClient.fetch(
      `*[_type == "passwordReset" && token == $token && used == false && dateTime(expiresAt) > dateTime(now())][0]{
        _id,
        user->{
          _id,
          name,
          email
        }
      }`,
      { token }
    );

    if (!resetToken) {
      return NextResponse.json(
        { message: 'Invalid or expired token' },
        { status: 400 }
      );
    }

    // Hash the new password
    const hashedPassword = await hash(password, 10);

    // Update the user's password
    await sanityWriteClient
      .patch(resetToken.user._id)
      .set({
        password: hashedPassword,
        passwordUpdatedAt: new Date().toISOString(),
      })
      .commit();

    // Mark the token as used
    await sanityWriteClient
      .patch(resetToken._id)
      .set({
        used: true,
        usedAt: new Date().toISOString(),
      })
      .commit();

    return NextResponse.json({
      message: 'Password reset successful',
    });
  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json(
      { message: 'An error occurred while resetting your password' },
      { status: 500 }
    );
  }
}
