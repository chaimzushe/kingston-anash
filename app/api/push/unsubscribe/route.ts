import { NextRequest, NextResponse } from 'next/server';
import { sanityClient } from '@/lib/sanity';

export async function POST(request: NextRequest) {
  try {
    const { endpoint } = await request.json();

    if (!endpoint) {
      return NextResponse.json(
        { message: 'Endpoint is required' },
        { status: 400 }
      );
    }

    // Find the subscription with the given endpoint
    const subscription = await sanityClient.fetch(
      `*[_type == "pushSubscription" && endpoint == $endpointParam && status == "active"][0]`,
      { endpointParam: endpoint }
    );

    if (!subscription) {
      return NextResponse.json(
        { message: 'Subscription not found' },
        { status: 404 }
      );
    }

    // Update the subscription status to unsubscribed
    await sanityClient
      .patch(subscription._id)
      .set({
        status: 'unsubscribed',
        updatedAt: new Date().toISOString(),
      })
      .commit();

    return NextResponse.json({
      message: 'Successfully unsubscribed from push notifications',
    });
  } catch (error) {
    console.error('Push unsubscribe error:', error);
    return NextResponse.json(
      { message: 'Failed to unsubscribe from push notifications' },
      { status: 500 }
    );
  }
}
