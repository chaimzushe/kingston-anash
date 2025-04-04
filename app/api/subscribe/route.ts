import { NextRequest, NextResponse } from 'next/server';
import { sanityClient, sanityWriteClient } from '@/lib/sanity';
// Generate a simple random token instead of using uuid
function generateToken() {
  return Math.random().toString(36).substring(2, 15) +
         Math.random().toString(36).substring(2, 15);
}

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
      `*[_type == "subscription" && email == $emailParam && status == "active"][0]`,
      { emailParam: email }
    );

    if (existingSubscription) {
      // Update existing subscription
      await sanityWriteClient
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
    const confirmationToken = generateToken();

    // Create new subscription
    const subscription = await sanityWriteClient.create({
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

    // More detailed error message
    const errorMessage = error instanceof Error
      ? `Error: ${error.message}`
      : 'Unknown error occurred';

    return NextResponse.json(
      {
        message: 'Failed to process subscription',
        error: errorMessage,
        details: 'Check if you have proper write permissions to Sanity and that the schema is correctly set up.'
      },
      { status: 500 }
    );
  }
}
