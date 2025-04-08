import { NextRequest, NextResponse } from 'next/server';
import { sanityClient } from '@/lib/sanity';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { message: 'Email is required' },
        { status: 400 }
      );
    }

    // Check if the email exists in the user collection
    const existingUser = await sanityClient.fetch(
      `*[_type == "user" && email == $emailParam][0]{
        _id,
        name,
        email,
        isVerified
      }`,
      { emailParam: email }
    );

    // Check if there's a pending access request
    const pendingRequest = await sanityClient.fetch(
      `*[_type == "accessRequest" && email == $emailParam && status == "pending"][0]{
        _id,
        name,
        email
      }`,
      { emailParam: email }
    );

    // Check if there's an approved access request
    const approvedRequest = await sanityClient.fetch(
      `*[_type == "accessRequest" && email == $emailParam && status == "approved"][0]{
        _id,
        name,
        email
      }`,
      { emailParam: email }
    );

    // Determine the status and message
    let status = 'unauthorized';
    let message = 'Email is not authorized. Please request access first.';
    const isEmailValid = !!approvedRequest || (!!existingUser && existingUser.isVerified);

    if (isEmailValid) {
      status = 'authorized';
      message = 'Email is authorized to access the system';
    } else if (pendingRequest) {
      status = 'pending';
      message = 'Your access request is pending approval. Please check back later.';
    }

    return NextResponse.json({
      isValid: isEmailValid,
      status,
      message
    });
  } catch (error) {
    console.error('Email validation error:', error);
    return NextResponse.json(
      { message: 'An error occurred while validating the email' },
      { status: 500 }
    );
  }
}
