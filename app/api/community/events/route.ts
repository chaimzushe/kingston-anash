import { NextRequest, NextResponse } from 'next/server';
import { sanityClient } from '@/lib/sanity';
import { currentUser } from '@clerk/nextjs/server';

// Get all community events
export async function GET(request: NextRequest) {
  try {
    // Check if user is authenticated
    const user = await currentUser();
    if (!user) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

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
      location,
      gender,
      creator,
      createdAt
    }`;

    // Fetch events from Sanity
    const events = await sanityClient.fetch(query);

    return NextResponse.json({ events });
  } catch (error) {
    console.error('Error fetching community events:', error);
    return NextResponse.json(
      { message: 'An error occurred while fetching events' },
      { status: 500 }
    );
  }
}
