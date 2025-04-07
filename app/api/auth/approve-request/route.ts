import { NextRequest, NextResponse } from 'next/server';
import { hash } from 'bcrypt';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../[...nextauth]/route';
import { sanityClient, sanityWriteClient } from '@/lib/sanity';

export async function POST(request: NextRequest) {
  try {
    // Check if the user is authenticated and is an admin
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { message: 'Unauthorized. Only administrators can approve access requests.' },
        { status: 401 }
      );
    }

    const { requestId, approved, password } = await request.json();

    // Validate input
    if (!requestId) {
      return NextResponse.json(
        { message: 'Request ID is required' },
        { status: 400 }
      );
    }

    // Get the access request
    const accessRequest = await sanityClient.fetch(
      `*[_type == "accessRequest" && _id == $requestId][0]`,
      { requestId }
    );

    if (!accessRequest) {
      return NextResponse.json(
        { message: 'Access request not found' },
        { status: 404 }
      );
    }

    // Update the access request status
    await sanityWriteClient
      .patch(accessRequest._id)
      .set({
        status: approved ? 'approved' : 'rejected',
        processedAt: new Date().toISOString(),
        processedBy: { _type: 'reference', _ref: session.user.id },
      })
      .commit();

    // If approved, create a user account
    if (approved) {
      // Check if a password was provided
      if (!password) {
        return NextResponse.json(
          { message: 'Password is required to create a user account' },
          { status: 400 }
        );
      }

      // Check if email already exists
      const existingUser = await sanityClient.fetch(
        `*[_type == "user" && email == $emailParam][0]`,
        { emailParam: accessRequest.email }
      );

      if (existingUser) {
        return NextResponse.json(
          { message: 'A user with this email already exists' },
          { status: 400 }
        );
      }

      // Hash the password
      const hashedPassword = await hash(password, 10);

      // Create user
      const user = await sanityWriteClient.create({
        _type: 'user',
        name: accessRequest.name,
        email: accessRequest.email,
        password: hashedPassword,
        isVerified: true,
        role: 'member',
        phone: accessRequest.phone,
        joinedDate: new Date().toISOString(),
      });

      return NextResponse.json({
        message: 'Access request approved and user account created',
        userId: user._id,
      });
    }

    return NextResponse.json({
      message: 'Access request ' + (approved ? 'approved' : 'rejected'),
    });
  } catch (error) {
    console.error('Access request processing error:', error);
    return NextResponse.json(
      { message: 'Failed to process access request' },
      { status: 500 }
    );
  }
}
