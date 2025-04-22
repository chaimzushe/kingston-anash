import { NextRequest, NextResponse } from 'next/server';
import { sanityWriteClient } from '@/lib/sanity';
import { revalidatePath } from 'next/cache';
import { EVENTS_TAG } from '@/lib/revalidate-tags';

export async function DELETE(request: NextRequest) {
  try {
    // Get the event ID and user ID from the request
    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get('id');
    const userId = searchParams.get('userId');

    if (!eventId) {
      return NextResponse.json(
        { message: 'Event ID is required' },
        { status: 400 }
      );
    }

    if (!userId) {
      return NextResponse.json(
        { message: 'User ID is required' },
        { status: 400 }
      );
    }

    console.log(`Attempting to delete event ${eventId} for user ${userId}`);

    try {
      try {
        // First check if the event exists and belongs to the current user
        const query = `*[_type == "communityEvent" && _id == $eventId && creator.id == $userId][0]`;
        const event = await sanityWriteClient.fetch(query, { eventId, userId });

        if (!event) {
          console.error(`Event ${eventId} not found or user ${userId} does not have permission to delete it`);
          return NextResponse.json(
            { message: 'Event not found or you do not have permission to delete it' },
            { status: 404 }
          );
        }

        console.log('Found event to delete:', event);

        // Delete the event from Sanity
        await sanityWriteClient.delete(eventId);

        console.log(`Successfully deleted event ${eventId} from Sanity`);

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
          message: 'Event deleted successfully',
          eventId,
          timestamp: new Date().toISOString(),
          revalidated: pathsToRevalidate
        });
      } catch (sanityError) {
        console.error('Error deleting event from Sanity:', sanityError);

        // Return error response
        return NextResponse.json({
          message: 'Error deleting event from Sanity',
          error: sanityError instanceof Error ? sanityError.message : 'Unknown error',
          timestamp: new Date().toISOString()
        }, { status: 500 });
      }
    } catch (error) {
      console.error('Error in delete API:', error);

      // Return error response
      return NextResponse.json(
        {
          message: 'Error deleting event',
          error: error instanceof Error ? error.message : 'Unknown error',
          timestamp: new Date().toISOString()
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error processing delete request:', error);
    return NextResponse.json(
      {
        message: 'An error occurred while processing the delete request',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
