import { NextRequest, NextResponse } from 'next/server';
import { sanityClient } from '@/lib/sanity';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  try {
    const { email, categories } = await request.json();

    // Validate input
    if (!email) {
      return NextResponse.json(
        { message: 'Email is required' },
        { status: 400 }
      );
    }

    if (!categories || !Array.isArray(categories) || categories.length === 0) {
      return NextResponse.json(
        { message: 'At least one category must be selected' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingSubscription = await sanityClient.fetch(
      `*[_type == "subscription" && email == $email && status == "active"][0]`,
      { email }
    );

    if (existingSubscription) {
      // Update existing subscription
      await sanityClient
        .patch(existingSubscription._id)
        .set({
          categories: categories.map((id: string) => ({
            _type: 'reference',
            _ref: id,
          })),
          updatedAt: new Date().toISOString(),
        })
        .commit();

      return NextResponse.json({
        message: 'Subscription preferences updated successfully',
      });
    }

    // Create confirmation token
    const confirmationToken = uuidv4();

    // Create new subscription
    const subscription = await sanityClient.create({
      _type: 'subscription',
      email,
      categories: categories.map((id: string) => ({
        _type: 'reference',
        _ref: id,
      })),
      status: 'active',
      confirmationToken,
      createdAt: new Date().toISOString(),
    });

    // In a real application, you would send a confirmation email here
    // For now, we'll just log the confirmation token
    console.log(`Confirmation token for ${email}: ${confirmationToken}`);

    return NextResponse.json({
      message: 'Subscription created successfully',
      subscriptionId: subscription._id,
    });
  } catch (error) {
    console.error('Subscription error:', error);
    return NextResponse.json(
      { message: 'Failed to process subscription' },
      { status: 500 }
    );
  }
}
