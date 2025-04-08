import { NextRequest, NextResponse } from 'next/server';
import { sanityClient, sanityWriteClient } from '@/lib/sanity';
import { v4 as uuidv4 } from 'uuid';

// Token expiration time in seconds (1 hour)
const TOKEN_EXPIRATION = 60 * 60;

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    // Validate input
    if (!email) {
      return NextResponse.json(
        { message: 'Email is required' },
        { status: 400 }
      );
    }

    // Find user by email
    const user = await sanityClient.fetch(
      `*[_type == "user" && email == $emailParam][0]{
        _id,
        name,
        email,
        isVerified
      }`,
      { emailParam: email }
    );

    // For security reasons, don't reveal if the user exists or not
    // Just return a success message regardless
    if (!user) {
      return NextResponse.json({
        message: 'If an account with this email exists, we have sent password reset instructions.',
      });
    }

    // Check if user is verified
    if (!user.isVerified) {
      return NextResponse.json({
        message: 'If an account with this email exists, we have sent password reset instructions.',
      });
    }

    // Generate a reset token
    const resetToken = uuidv4();
    const expiresAt = new Date(Date.now() + TOKEN_EXPIRATION * 1000).toISOString();

    // Store the reset token in Sanity
    await sanityWriteClient.create({
      _type: 'passwordReset',
      user: { _type: 'reference', _ref: user._id },
      token: resetToken,
      expiresAt,
      createdAt: new Date().toISOString(),
      used: false,
    });

    // In a real application, you would send an email with the reset link
    // For now, we'll just log it to the console
    const resetLink = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/auth/reset-password?token=${resetToken}`;
    console.log('Password reset link:', resetLink);

    // TODO: Send email with reset link
    // Example: await sendEmail(user.email, 'Password Reset', `Click this link to reset your password: ${resetLink}`);

    return NextResponse.json({
      message: 'If an account with this email exists, we have sent password reset instructions.',
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { message: 'An error occurred while processing your request' },
      { status: 500 }
    );
  }
}
