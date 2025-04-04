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
      `*[_type == "pushSubscription" && endpoint == $endpointParam && status == "active"][0]{
        "categories": categories[]->._id
      }`,
      { endpointParam: endpoint }
    );

    if (!subscription) {
      return NextResponse.json(
        { message: 'Subscription not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      categories: subscription.categories || [],
    });
  } catch (error) {
    console.error('Get categories error:', error);
    return NextResponse.json(
      { message: 'Failed to retrieve notification preferences' },
      { status: 500 }
    );
  }
}
