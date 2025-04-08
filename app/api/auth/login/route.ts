import { NextRequest, NextResponse } from 'next/server';
import { compare } from 'bcrypt';
import { sanityClient } from '@/lib/sanity';
import { v4 as uuidv4 } from 'uuid';

// Session duration in seconds (7 days)
const SESSION_DURATION = 7 * 24 * 60 * 60;

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Find user by email
    const user = await sanityClient.fetch(
      `*[_type == "user" && email == $emailParam][0]{
        _id,
        name,
        email,
        password,
        role,
        isVerified
      }`,
      { emailParam: email }
    );

    // Check if user exists
    if (!user) {
      return NextResponse.json(
        { message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Check if user is verified
    if (!user.isVerified) {
      return NextResponse.json(
        { message: 'Your account is pending verification by an administrator' },
        { status: 403 }
      );
    }

    // Check if password is correct
    // For development, check if the password is stored in plain text
    let passwordCorrect = false;

    if (user.password.startsWith('$2')) {
      // Password is hashed with bcrypt
      passwordCorrect = await compare(password, user.password);
    } else {
      // Password is stored in plain text (temporary for development)
      passwordCorrect = password === user.password;
    }

    if (!passwordCorrect) {
      return NextResponse.json(
        { message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // In a production app, you would store the session in a database
    // For now, we'll just return the user data without the password
    const { password: _, ...userWithoutPassword } = user;

    // Generate a session token
    const sessionToken = uuidv4();

    // Create the response with the user data
    const response = NextResponse.json({
      message: 'Login successful',
      user: userWithoutPassword,
    });

    // Set the cookie in the response
    response.cookies.set({
      name: 'session_token',
      value: sessionToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: SESSION_DURATION,
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: 'An error occurred during login' },
      { status: 500 }
    );
  }
}
