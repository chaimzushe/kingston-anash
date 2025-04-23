import { NextRequest, NextResponse } from 'next/server';
import { sanityClient } from '@/lib/sanity';
import { requireAuth } from '@/lib/auth-utils';
import { groq } from 'next-sanity';

export async function GET(request: NextRequest) {
  try {
    // Authenticate the user
    const authResult = await requireAuth(request);
    
    if (!authResult.success) {
      return authResult.response;
    }
    
    const userId = authResult.userId;
    
    // Fetch the user's rides from Sanity
    const rides = await sanityClient.fetch(
      groq`*[_type == "ride" && userId == $userId] | order(departureDate asc) {
        _id,
        driverName,
        origin,
        destination,
        departureDate,
        departureTime,
        isRoundTrip,
        returnDate,
        returnTime,
        availableSeats,
        pricePerSeat,
        vehicleType,
        notes,
        contactEmail,
        contactPhone,
        userId,
        userEmail,
        postedDate
      }`,
      { userId }
    );
    
    // Transform the data to match our frontend model
    const transformedRides = rides.map((ride: any) => ({
      id: ride._id,
      driverName: ride.driverName,
      origin: ride.origin,
      destination: ride.destination,
      departureDate: ride.departureDate,
      departureTime: ride.departureTime,
      isRoundTrip: ride.isRoundTrip,
      returnDate: ride.returnDate,
      returnTime: ride.returnTime,
      availableSeats: ride.availableSeats,
      pricePerSeat: ride.pricePerSeat,
      vehicleType: ride.vehicleType,
      notes: ride.notes,
      contactEmail: ride.contactEmail,
      contactPhone: ride.contactPhone,
      userId: ride.userId,
      userEmail: ride.userEmail,
      postedDate: ride.postedDate,
    }));
    
    return NextResponse.json(transformedRides);
  } catch (error) {
    console.error('Error fetching user rides:', error);
    return NextResponse.json({ error: 'Failed to fetch user rides' }, { status: 500 });
  }
}
