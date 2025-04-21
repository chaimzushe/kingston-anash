import { NextRequest, NextResponse } from 'next/server';
import { sanityClient } from '@/lib/sanity';
import { getMockEvents } from '@/lib/mockEvents';
import { Event } from '@/types/events';

// Get all community events
export async function GET(request: NextRequest) {
  try {
    // This API is public, no authentication check needed

    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const date = searchParams.get('date');

    // Build the query
    let query = `*[_type == "communityEvent"`;

    // Add date filter if provided
    if (date) {
      query += ` && date == "${date}"`;
    }

    // Complete the query and sort by date and startTime
    query += `] | order(date asc, startTime asc) {
      _id,
      title,
      description,
      date,
      startTime,
      endTime,
      duration,
      location,
      gender,
      creator,
      createdAt
    }`;

    try {
      // Fetch events from Sanity
      const sanityEvents = await sanityClient.fetch(query);

      // Since getMockEvents uses localStorage which is browser-only,
      // we can't use it directly in the API route
      // Instead, we'll use an empty array for server-side rendering
      const mockEvents: Event[] = [];

      // Filter mock events by date if needed
      const filteredMockEvents = date
        ? mockEvents.filter(event => event.date === date)
        : mockEvents;

      // Combine Sanity events and mock events
      const allEvents = [...sanityEvents, ...filteredMockEvents];

      // Sort events by date and start time
      const sortedEvents = allEvents.sort((a, b) => {
        // First sort by date
        const dateComparison = a.date.localeCompare(b.date);
        if (dateComparison !== 0) return dateComparison;

        // Then sort by start time
        return a.startTime.localeCompare(b.startTime);
      });

      console.log('Returning events:', sortedEvents.length, 'total events');

      return NextResponse.json({ events: sortedEvents });
    } catch (sanityError) {
      console.error('Error fetching from Sanity:', sanityError);

      // If Sanity fails, fall back to mock events only
      // Since getMockEvents uses localStorage which is browser-only,
      // we can't use it directly in the API route
      const mockEvents: Event[] = [];

      // Filter mock events by date if needed
      const filteredMockEvents = date
        ? mockEvents.filter(event => event.date === date)
        : mockEvents;

      console.log('Falling back to mock events only:', filteredMockEvents.length, 'events');

      return NextResponse.json({ events: filteredMockEvents });
    }
  } catch (error) {
    console.error('Error fetching community events:', error);
    return NextResponse.json(
      { message: 'An error occurred while fetching events' },
      { status: 500 }
    );
  }
}
