import { NextRequest, NextResponse } from 'next/server';
import { sanityClient, sanityWriteClient } from '@/lib/sanity';

export async function POST(request: NextRequest) {
  try {
    const { subscription, categories } = await request.json();

    if (!subscription || !subscription.endpoint) {
      return NextResponse.json(
        { message: 'Invalid subscription data' },
        { status: 400 }
      );
    }

    // Check if this endpoint is already registered
    const existingSubscription = await sanityClient.fetch(
      `*[_type == "pushSubscription" && endpoint == $endpointParam && status == "active"][0]`,
      { endpointParam: subscription.endpoint }
    );

    if (existingSubscription) {
      // Update existing subscription
      await sanityWriteClient
        .patch(existingSubscription._id)
        .set({
          categories: (categories || []).map((id: string) => ({
            _type: 'reference',
            _ref: id,
          })),
          updatedAt: new Date().toISOString(),
        })
        .commit();

      return NextResponse.json({
        message: 'Push subscription updated successfully',
      });
    }

    // Create new subscription
    const newSubscription = await sanityWriteClient.create({
      _type: 'pushSubscription',
      endpoint: subscription.endpoint,
      keys: {
        p256dh: subscription.keys.p256dh,
        auth: subscription.keys.auth,
      },
      categories: (categories || []).map((id: string) => ({
        _type: 'reference',
        _ref: id,
      })),
      status: 'active',
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({
      message: 'Push subscription created successfully',
      subscriptionId: newSubscription._id,
    });
  } catch (error) {
    console.error('Push subscription error:', error);

    // More detailed error message
    const errorMessage = error instanceof Error
      ? `Error: ${error.message}`
      : 'Unknown error occurred';

    return NextResponse.json(
      {
        message: 'Failed to process push subscription',
        error: errorMessage,
        details: 'Check if you have proper write permissions to Sanity and that the pushSubscription schema is correctly set up.'
      },
      { status: 500 }
    );
  }
}
