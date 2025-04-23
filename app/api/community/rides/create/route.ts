import { NextRequest, NextResponse } from 'next/server';
import { sanityClient } from '@/lib/sanity';
import { requireAuth } from '@/lib/auth-utils';

export async function POST(request: NextRequest) {
  try {
    // Authenticate the user
    const authResult = await requireAuth(request);
    
    if (!authResult.success) {
      return authResult.response;
    }
    
    const userId = authResult.userId;
    
    // Parse the request body
    const data = await request.json();
    
    // Validate required fields
    if (!data.origin || !data.destination || !data.departureDate || !data.departureTime || !data.availableSeats) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    // Prepare the document
    const doc: any = {
      _type: 'ride',
      driverName: data.driverName || 'Anonymous',
      origin: data.origin,
      destination: data.destination,
      departureDate: data.departureDate,
      departureTime: data.departureTime,
      isRoundTrip: data.isRoundTrip || false,
      availableSeats: data.availableSeats,
      pricePerSeat: data.pricePerSeat || 0,
      contactEmail: data.contactEmail || null,
      contactPhone: data.contactPhone || null,
      postedDate: new Date().toISOString(),
      userId: userId,
      userEmail: data.userEmail || '',
    };
    
    // Add optional fields if they exist
    if (data.vehicleType) doc.vehicleType = data.vehicleType;
    if (data.notes) doc.notes = data.notes;
    
    // Add round trip data if applicable
    if (data.isRoundTrip) {
      if (data.returnDate) doc.returnDate = data.returnDate;
      if (data.returnTime) doc.returnTime = data.returnTime;
    }
    
    console.log('Creating ride with document:', JSON.stringify(doc, null, 2));
    
    try {
      const result = await sanityClient.create(doc);
      console.log('Ride created successfully:', result);
      return NextResponse.json({ success: true, id: result._id });
    } catch (createError) {
      console.error('Error creating document in Sanity:', createError);
      throw createError;
    }
  } catch (error) {
    console.error('Error creating ride:', error);
    return NextResponse.json({ 
      error: 'Failed to create ride', 
      details: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}
