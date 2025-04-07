import { NextRequest, NextResponse } from 'next/server';
import { hash } from 'bcrypt';
import { sanityClient, sanityWriteClient } from '@/lib/sanity';

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json();

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json(
        { message: 'Name, email, and password are required' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingUser = await sanityClient.fetch(
      `*[_type == "user" && email == $emailParam][0]`,
      { emailParam: email }
    );

    if (existingUser) {
      return NextResponse.json(
        { message: 'A user with this email already exists' },
        { status: 400 }
      );
    }

    // Hash the password
    const hashedPassword = await hash(password, 10);

    // Create user (not verified by default)
    const user = await sanityWriteClient.create({
      _type: 'user',
      name,
      email,
      password: hashedPassword,
      isVerified: false, // Users need to be verified by an admin
      role: 'member',
      joinedDate: new Date().toISOString(),
    });

    return NextResponse.json({
      message: 'User registered successfully. An administrator will verify your account.',
      userId: user._id,
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { message: 'Failed to register user' },
      { status: 500 }
    );
  }
}
