import { NextRequest, NextResponse } from 'next/server';
import { sanityClient } from '@/lib/sanity';
import { auth } from '@clerk/nextjs/server';
import { groq } from 'next-sanity';

export async function PUT(request: NextRequest) {
  try {
    const { userId } = auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    const { id, ...updates } = data;

    if (!id) {
      return NextResponse.json({ error: 'Missing giveaway ID' }, { status: 400 });
    }

    // Check if the user owns this giveaway
    const existingGiveaway = await sanityClient.fetch(
      groq`*[_type == "giveaway" && _id == $id && userId == $userId][0]`,
      { id, userId }
    );

    if (!existingGiveaway) {
      return NextResponse.json({ error: 'Giveaway not found or you do not have permission to update it' }, { status: 403 });
    }

    // Prepare the update
    const doc = {
      ...updates,
      _type: 'giveaway',
    };

    // Handle image updates if provided
    if (updates.images && Array.isArray(updates.images)) {
      doc.images = updates.images.map((image: any) => ({
        _type: 'image',
        asset: {
          _type: 'reference',
          _ref: image.assetId
        }
      }));
    }

    const result = await sanityClient
      .patch(id)
      .set(doc)
      .commit();

    return NextResponse.json({ success: true, id: result._id });
  } catch (error) {
    console.error('Error updating giveaway:', error);
    return NextResponse.json({ error: 'Failed to update giveaway' }, { status: 500 });
  }
}
