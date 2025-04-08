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

    // Check if the email exists in the accessRequest collection with status 'approved'
    const approvedRequest = await sanityClient.fetch(
      `*[_type == "accessRequest" && email == $emailParam && status == "approved"][0]{
        _id,
        name,
        email
      }`,
      { emailParam: email }
    );

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

    // If the email exists in either collection, it's valid
    const isEmailValid = !!approvedRequest || (!!existingUser && existingUser.isVerified);

    return NextResponse.json({
      isValid: isEmailValid,
      message: isEmailValid 
        ? 'Email is authorized to access the system' 
        : 'Email is not authorized. Please request access first.'
    });
  } catch (error) {
    console.error('Email validation error:', error);
    return NextResponse.json(
      { message: 'An error occurred while validating the email' },
      { status: 500 }
    );
  }
}
