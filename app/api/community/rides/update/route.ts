import { NextRequest, NextResponse } from 'next/server';
import { sanityClient } from '@/lib/sanity';
import { requireAuth } from '@/lib/auth-utils';
import { groq } from 'next-sanity';

export async function PUT(request: NextRequest) {
  try {
    // Authenticate the user
    const authResult = await requireAuth(request);
    
    if (!authResult.success) {
      return authResult.response;
    }
    
    const userId = authResult.userId;
    
    // Parse the request body
    const updates = await request.json();
    
    // Validate required fields
    if (!updates.id) {
      return NextResponse.json({ error: 'Ride ID is required' }, { status: 400 });
    }
    
    // Check if the ride exists and belongs to the user
    const existingRide = await sanityClient.fetch(
      groq`*[_type == "ride" && _id == $id][0]`,
      { id: updates.id }
    );
    
    if (!existingRide) {
      return NextResponse.json({ error: 'Ride not found' }, { status: 404 });
    }
    
    if (existingRide.userId !== userId) {
      return NextResponse.json({ error: 'You do not have permission to update this ride' }, { status: 403 });
    }
    
    // Prepare the update
    const doc: any = {
      _type: 'ride',
    };
    
    // Add fields to update
    if (updates.origin) doc.origin = updates.origin;
    if (updates.destination) doc.destination = updates.destination;
    if (updates.departureDate) doc.departureDate = updates.departureDate;
    if (updates.departureTime) doc.departureTime = updates.departureTime;
    if (typeof updates.isRoundTrip !== 'undefined') doc.isRoundTrip = updates.isRoundTrip;
    if (updates.returnDate) doc.returnDate = updates.returnDate;
    if (updates.returnTime) doc.returnTime = updates.returnTime;
    if (typeof updates.availableSeats !== 'undefined') doc.availableSeats = updates.availableSeats;
    if (typeof updates.pricePerSeat !== 'undefined') doc.pricePerSeat = updates.pricePerSeat;
    if (updates.vehicleType) doc.vehicleType = updates.vehicleType;
    if (typeof updates.notes !== 'undefined') doc.notes = updates.notes;
    if (updates.contactPhone) doc.contactPhone = updates.contactPhone;
    
    console.log('Updating ride with document:', JSON.stringify(doc, null, 2));
    
    // Update the document in Sanity
    const result = await sanityClient
      .patch(updates.id)
      .set(doc)
      .commit();
    
    return NextResponse.json({ success: true, id: result._id });
  } catch (error) {
    console.error('Error updating ride:', error);
    return NextResponse.json({ 
      error: 'Failed to update ride', 
      details: error instanceof Error ? error.message : String(error) 
    }, { status: 500 });
  }
}
