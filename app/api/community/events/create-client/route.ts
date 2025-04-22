import { NextRequest, NextResponse } from 'next/server';
import { sanityWriteClient } from '@/lib/sanity';
import { createDocument } from '@/lib/sanity-management';
import { revalidatePath } from 'next/cache';
import { EVENTS_TAG } from '@/lib/revalidate-tags';

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const eventData = await request.json();

    // Validate required fields
    if (!eventData.title || !eventData.date || !eventData.startTime || !eventData.location) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate creator
    if (!eventData.creator || !eventData.creator.id) {
      return NextResponse.json(
        { message: 'Creator information is required' },
        { status: 400 }
      );
    }

    console.log('Creating event with data:', eventData);

    // Create the event in Sanity
    try {
      // Prepare the event data
      const eventDocument = {
        _type: 'communityEvent',
        title: eventData.title,
        description: eventData.description || '',
        date: eventData.date,
        startTime: eventData.startTime,
        endTime: eventData.endTime || null,
        duration: eventData.duration ? parseInt(eventData.duration) : null,
        location: eventData.location,
        gender: eventData.gender || 'both',
        creator: {
          id: eventData.creator.id,
          name: eventData.creator.name || 'Anonymous',
          email: eventData.creator.email || ''
        },
        createdAt: new Date().toISOString()
      };

      console.log('Creating Sanity event with data:', eventDocument);

      try {
        // Create the event in Sanity using the Management API
        const createResult = await createDocument('communityEvent', eventDocument);

        if (!createResult.success) {
          throw new Error(`Failed to create event with Management API: ${createResult.error}`);
        }

        const createdEvent = createResult.result;
        console.log('Created Sanity event with Management API:', createdEvent);

        // Revalidate relevant paths
        const pathsToRevalidate = [
          '/community/events',
          '/api/community/events',
          '/profile'
        ];

        // Revalidate each path
        pathsToRevalidate.forEach(path => {
          console.log(`Revalidating path: ${path}`);
          revalidatePath(path);
        });

        // Return success response
        return NextResponse.json({
          message: 'Event created successfully',
          event: createdEvent,
          timestamp: new Date().toISOString(),
          revalidated: pathsToRevalidate
        });
      } catch (sanityError) {
        console.error('Error creating event in Sanity:', sanityError);

        // Return error response
        return NextResponse.json({
          message: 'Error creating event in Sanity',
          error: sanityError instanceof Error ? sanityError.message : 'Unknown error',
          timestamp: new Date().toISOString()
        }, { status: 500 });
      }
    } catch (error) {
      console.error('Error in create-client API:', error);

      // Return error response
      return NextResponse.json(
        {
          message: 'Error creating event',
          error: error instanceof Error ? error.message : 'Unknown error',
          timestamp: new Date().toISOString()
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error creating event:', error);
    return NextResponse.json(
      {
        message: 'An error occurred while creating the event',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
