import { NextRequest, NextResponse } from 'next/server';
import { sanityClient } from '@/lib/sanity';
import { requireAuth } from '@/lib/auth-utils';
import { groq } from 'next-sanity';

export async function DELETE(request: NextRequest) {
  try {
    const authResult = await requireAuth(request);

    if (!authResult.success) {
      return authResult.response;
    }

    const userId = authResult.userId;

    const url = new URL(request.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing giveaway ID' }, { status: 400 });
    }

    // Check if the user owns this giveaway
    const existingGiveaway = await sanityClient.fetch(
      groq`*[_type == "giveaway" && _id == $id && userId == $userId][0]`,
      { id, userId }
    );

    if (!existingGiveaway) {
      return NextResponse.json({ error: 'Giveaway not found or you do not have permission to delete it' }, { status: 403 });
    }

    await sanityClient.delete(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting giveaway:', error);
    return NextResponse.json({ error: 'Failed to delete giveaway' }, { status: 500 });
  }
}
