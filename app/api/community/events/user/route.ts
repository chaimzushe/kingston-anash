import { NextRequest, NextResponse } from 'next/server';
import { sanityClient } from '@/lib/sanity';
import { Event } from '@/types/events';
import { getAuth } from '@clerk/nextjs/server';

// Set revalidation time to 60 seconds
export const revalidate = 60;

// Get events created by the current user
export async function GET(request: NextRequest) {
  try {
    // Get the current user from Clerk
    const { userId } = getAuth(request);

    if (!userId) {
      return NextResponse.json(
        { message: 'Authentication required' },
        { status: 401 }
      );
    }

    // Build the query to get events created by this user
    const query = `*[_type == "communityEvent" && creator.id == $userId] | order(date desc, startTime asc) {
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
      const sanityEvents = await sanityClient.fetch(query, { userId });

      // Use only Sanity events
      const allEvents = [...sanityEvents];

      // Sort events by date (descending) and start time
      const sortedEvents = allEvents.sort((a, b) => {
        // First sort by date (descending)
        const dateComparison = b.date.localeCompare(a.date);
        if (dateComparison !== 0) return dateComparison;

        // Then sort by start time
        return a.startTime.localeCompare(b.startTime);
      });

      console.log(`Returning ${sortedEvents.length} events for user ${userId}`);

      return NextResponse.json({ events: sortedEvents });
    } catch (sanityError) {
      console.error('Error fetching from Sanity:', sanityError);

      // If Sanity fails, return empty array
      console.log(`Returning empty events array due to Sanity API error for user ${userId}`);

      return NextResponse.json({
        events: [],
        timestamp: new Date().toISOString(),
        source: 'sanity-api-error',
        message: 'Error connecting to Sanity API'
      });
    }
  } catch (error) {
    console.error('Error fetching user events:', error);
    return NextResponse.json(
      {
        message: 'An error occurred while fetching events',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
