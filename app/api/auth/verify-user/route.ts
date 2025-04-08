import { NextRequest, NextResponse } from 'next/server';
import { sanityClient } from '@/lib/sanity';

export async function POST(request: NextRequest) {
  try {
    // Get the user's email from the request body
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { message: 'Email not provided' },
        { status: 400 }
      );
    }

    // Check if the user exists in Sanity
    const existingUser = await sanityClient.fetch(
      `*[_type == "user" && email == $emailParam][0]{
        _id,
        name,
        email,
        isVerified
      }`,
      { emailParam: email }
    );

    // Check if there's an approved access request
    const approvedRequest = await sanityClient.fetch(
      `*[_type == "accessRequest" && email == $emailParam && status == "approved"][0]{
        _id,
        name,
        email,
        clerkUserId
      }`,
      { emailParam: email }
    );

    // Check if there's a pending access request
    const pendingRequest = await sanityClient.fetch(
      `*[_type == "accessRequest" && email == $emailParam && status == "pending"][0]{
        _id,
        name,
        email,
        clerkUserId
      }`,
      { emailParam: email }
    );

    // Determine if the user is authorized
    const isAuthorized = !!existingUser || !!approvedRequest;

    if (isAuthorized) {
      return NextResponse.json({
        isVerified: true,
        status: 'approved',
        user: existingUser || approvedRequest,
        message: 'User is verified in Sanity'
      });
    } else if (pendingRequest) {
      return NextResponse.json({
        isVerified: false,
        isPending: true,
        status: 'pending',
        user: pendingRequest,
        message: 'Your access request is pending approval. Please check back later.'
      });
    } else {
      // Check if there's a rejected access request
      const rejectedRequest = await sanityClient.fetch(
        `*[_type == "accessRequest" && email == $emailParam && status == "rejected"][0]{
          _id,
          name,
          email,
          clerkUserId,
          rejectionReason
        }`,
        { emailParam: email }
      );

      if (rejectedRequest) {
        return NextResponse.json({
          isVerified: false,
          isPending: false,
          status: 'rejected',
          user: rejectedRequest,
          message: rejectedRequest.rejectionReason || 'Your access request has been rejected.'
        });
      } else {
        return NextResponse.json({
          isVerified: false,
          isPending: false,
          status: 'unauthorized',
          message: 'Your account is not authorized. Please request access.'
        });
      }
    }
  } catch (error) {
    console.error('User verification error:', error);
    return NextResponse.json(
      { message: 'Failed to verify user' },
      { status: 500 }
    );
  }
}
