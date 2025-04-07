import { NextRequest, NextResponse } from 'next/server';
// import { hash } from 'bcrypt'; // Uncomment when bcrypt is installed
// import { cookies } from 'next/headers'; // Uncomment when using authentication
import { sanityClient, sanityWriteClient } from '@/lib/sanity';

export async function POST(request: NextRequest) {
  try {
    // Check if the user is authenticated and is an admin
    // For now, we'll skip this check since next-auth is not installed
    // In a real app, you would check authentication here

    // In a production environment, we would check for admin permissions
    // For now, we'll allow all requests for development purposes
    // const cookieStore = cookies();
    // const isAdmin = cookieStore.get('admin')?.value === 'true';

    /*
    if (!isAdmin) {
      // For development, we'll allow all requests
      // In production, uncomment the next lines
      // return NextResponse.json(
      //   { message: 'Unauthorized. Only administrators can create users.' },
      //   { status: 401 }
      // );
    }
    */

    const { name, email, password, isVerified = true } = await request.json();

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

    // Hash the password - temporarily using plain text for development
    // In production, use bcrypt to hash the password
    // const hashedPassword = await hash(password, 10);
    const hashedPassword = password; // TEMPORARY - REMOVE IN PRODUCTION

    // Create user
    const user = await sanityWriteClient.create({
      _type: 'user',
      name,
      email,
      password: hashedPassword,
      isVerified,
      role: 'member',
      joinedDate: new Date().toISOString(),
    });

    return NextResponse.json({
      message: 'User created successfully',
      userId: user._id,
    });
  } catch (error) {
    console.error('User creation error:', error);
    return NextResponse.json(
      { message: 'Failed to create user' },
      { status: 500 }
    );
  }
}
