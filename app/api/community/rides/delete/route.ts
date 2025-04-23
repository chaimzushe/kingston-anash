import { NextRequest, NextResponse } from 'next/server';
import { sanityClient } from '@/lib/sanity';
import { requireAuth } from '@/lib/auth-utils';
import { groq } from 'next-sanity';

export async function DELETE(request: NextRequest) {
  try {
    // Authenticate the user
    const authResult = await requireAuth(request);
    
    if (!authResult.success) {
      return authResult.response;
    }
    
    const userId = authResult.userId;
    
    // Get the ride ID from the URL
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'Ride ID is required' }, { status: 400 });
    }
    
    // Check if the ride exists and belongs to the user
    const existingRide = await sanityClient.fetch(
      groq`*[_type == "ride" && _id == $id][0]`,
      { id }
    );
    
    if (!existingRide) {
      return NextResponse.json({ error: 'Ride not found' }, { status: 404 });
    }
    
    if (existingRide.userId !== userId) {
      return NextResponse.json({ error: 'You do not have permission to delete this ride' }, { status: 403 });
    }
    
    // Delete the ride
    await sanityClient.delete(id);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting ride:', error);
    return NextResponse.json({ error: 'Failed to delete ride' }, { status: 500 });
  }
}
