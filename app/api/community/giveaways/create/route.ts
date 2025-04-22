import { NextRequest, NextResponse } from 'next/server';
import { sanityClient } from '@/lib/sanity';
import { auth } from '@clerk/nextjs/server';

export async function POST(request: NextRequest) {
  try {
    const { userId } = auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();

    // Validate required fields
    const requiredFields = ['title', 'location'];
    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 });
      }
    }

    // Prepare the document
    const doc = {
      _type: 'giveaway',
      title: data.title,
      description: data.description,
      condition: data.condition,
      category: data.category,
      location: data.location,
      contactName: data.contactName,
      contactEmail: data.contactEmail || null,
      contactPhone: data.contactPhone || null,
      postedDate: new Date().toISOString(),
      isAvailable: true,
      price: data.price || 0,
      isFree: data.isFree !== false, // Default to true if not specified
      tags: data.tags || [],
      userId: userId,
      userEmail: data.userEmail || '',
    };

    // Handle image uploads separately as they need to be processed by Sanity
    // This is a placeholder - actual image upload will be handled in the frontend
    // and the image references will be passed in the request

    if (data.images && Array.isArray(data.images)) {
      doc.images = data.images.map((image: any) => ({
        _type: 'image',
        asset: {
          _type: 'reference',
          _ref: image.assetId
        }
      }));
    }

    const result = await sanityClient.create(doc);

    return NextResponse.json({ success: true, id: result._id });
  } catch (error) {
    console.error('Error creating giveaway:', error);
    return NextResponse.json({ error: 'Failed to create giveaway' }, { status: 500 });
  }
}
