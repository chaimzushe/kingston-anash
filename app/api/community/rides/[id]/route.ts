import { NextRequest, NextResponse } from 'next/server';
import { sanityClient } from '@/lib/sanity';
import { groq } from 'next-sanity';

export async function GET(request: NextRequest) {
  try {
    // Extract the id from the URL
    const url = new URL(request.url);
    const id = url.pathname.split('/').pop();

    if (!id) {
      return NextResponse.json({ error: 'Ride ID is required' }, { status: 400 });
    }

    // Fetch the ride from Sanity
    const ride = await sanityClient.fetch(
      groq`*[_type == "ride" && _id == $id][0]{
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
      { id }
    );

    if (!ride) {
      return NextResponse.json({ error: 'Ride not found' }, { status: 404 });
    }

    // Transform the data to match our frontend model
    const transformedRide = {
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
    };

    return NextResponse.json(transformedRide);
  } catch (error) {
    console.error('Error fetching ride:', error);
    return NextResponse.json({ error: 'Failed to fetch ride' }, { status: 500 });
  }
}
