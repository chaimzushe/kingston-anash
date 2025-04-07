import { NextRequest, NextResponse } from 'next/server';
import { sanityClient, sanityWriteClient } from '@/lib/sanity';

export async function POST(request: NextRequest) {
  try {
    const { name, email, phone, message } = await request.json();

    // Validate input
    if (!name || !email) {
      return NextResponse.json(
        { message: 'Name and email are required' },
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

    // Create access request
    const accessRequest = await sanityWriteClient.create({
      _type: 'accessRequest',
      name,
      email,
      phone,
      message,
      status: 'pending',
      createdAt: new Date().toISOString(),
    });

    // In a real application, you would send an email notification to administrators here

    return NextResponse.json({
      message: 'Access request submitted successfully',
      requestId: accessRequest._id,
    });
  } catch (error) {
    console.error('Access request error:', error);
    return NextResponse.json(
      { message: 'Failed to process access request' },
      { status: 500 }
    );
  }
}
