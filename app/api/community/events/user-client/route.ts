import { NextRequest, NextResponse } from 'next/server';
import { sanityClient, createEventsQuery } from '@/lib/sanity';
import { Event } from '@/types/events';
import { EVENTS_TAG } from '@/lib/revalidate-tags';

// Set revalidation time to 60 seconds
export const revalidate = 60; // seconds

// Add tag-based revalidation
export const fetchCache = 'force-no-store';
export const dynamicParams = true;

// Note: generateMetadata is not supported in route handlers

// Get events created by a specific user (client-side version)
export async function GET(request: NextRequest) {
  try {
    // Get the user ID from the query parameters
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { message: 'User ID is required' },
        { status: 400 }
      );
    }

    console.log(`Fetching events for user ${userId}`);

    // Build the query to get movies
    // Note: The public movies dataset doesn't have user-specific data
    // So we're just getting all movies as a demonstration
    const userFilter = ``;
    const query = createEventsQuery(userFilter);

    console.log(`Executing Sanity query for user ${userId}:`, query);

    try {
      // Fetch events from Sanity with proper caching headers
      try {
        // Add a timestamp to the query to bypass caching
        const timestamp = Date.now();
        console.log(`Adding timestamp ${timestamp} to query to bypass caching`);

        const events = await sanityClient.fetch(
          query,
          { userId, _timestamp: timestamp }, // Add timestamp to params
          {
            // Add cache tags for revalidation and force no caching
            next: {
              tags: [EVENTS_TAG],
              revalidate: 0 // Force revalidation on every request
            }
          }
        );

        console.log(`Found ${events.length} Sanity events for user ${userId}`);

        return NextResponse.json({
          events,
          timestamp: new Date().toISOString(),
          source: 'sanity-api'
        });
      } catch (sanityError) {
        console.error('Error fetching from Sanity:', sanityError);

        // Return empty events array instead of mock data
        console.log('Returning empty events array due to Sanity API error');

        // Return empty events array
        return NextResponse.json({
          events: [],
          timestamp: new Date().toISOString(),
          source: 'sanity-api-error',
          message: 'Error connecting to Sanity API'
        });
      }
    } catch (error) {
      console.error('Error in user-client API:', error);

      // Return an error response
      return NextResponse.json(
        {
          message: 'Error fetching user events',
          error: error instanceof Error ? error.message : 'Unknown error',
          timestamp: new Date().toISOString(),
          events: [] // Return empty array for backward compatibility
        },
        { status: 500 }
      );
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
