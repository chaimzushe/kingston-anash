import { NextRequest, NextResponse } from 'next/server';
import { sanityClient, sanityWriteClient } from '@/lib/sanity';

export async function POST(request: NextRequest) {
  try {
    const { endpoint, categories } = await request.json();

    if (!endpoint) {
      return NextResponse.json(
        { message: 'Endpoint is required' },
        { status: 400 }
      );
    }

    if (!categories || !Array.isArray(categories)) {
      return NextResponse.json(
        { message: 'Categories must be an array' },
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

    // Update the subscription categories
    await sanityWriteClient
      .patch(subscription._id)
      .set({
        categories: categories.map((id: string) => ({
          _type: 'reference',
          _ref: id,
        })),
        updatedAt: new Date().toISOString(),
      })
      .commit();

    return NextResponse.json({
      message: 'Successfully updated notification preferences',
    });
  } catch (error) {
    console.error('Update categories error:', error);
    return NextResponse.json(
      { message: 'Failed to update notification preferences' },
      { status: 500 }
    );
  }
}
