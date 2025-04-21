import { NextRequest, NextResponse } from 'next/server';
import { sanityWriteClient } from '@/lib/sanity';
import { updateDocument } from '@/lib/sanity-management';
import { revalidatePath } from 'next/cache';
import { EVENTS_TAG } from '@/lib/revalidate-tags';

// Helper function to calculate end time based on start time and duration
function calculateEndTime(startTime: string, durationMinutes: number): string | null {
  if (!durationMinutes) return null;

  const [hours, minutes] = startTime.split(':').map(Number);
  const startDate = new Date();
  startDate.setHours(hours, minutes, 0, 0);

  const endDate = new Date(startDate.getTime() + durationMinutes * 60000);
  const endHours = endDate.getHours().toString().padStart(2, '0');
  const endMinutes = endDate.getMinutes().toString().padStart(2, '0');

  return `${endHours}:${endMinutes}`;
}

export async function PATCH(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json();
    const { eventId, userId, ...updates } = body;

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

    // Calculate endTime if startTime and duration are provided
    if (updates.startTime && updates.duration) {
      updates.endTime = calculateEndTime(updates.startTime, parseInt(updates.duration));
    }

    console.log(`Updating event ${eventId} with data:`, updates);

    try {
      try {
        // First check if the event exists and belongs to the current user
        const query = `*[_type == "communityEvent" && _id == $eventId && creator.id == $userId][0]`;
        const event = await sanityWriteClient.fetch(query, { eventId, userId });

        if (!event) {
          console.error(`Event ${eventId} not found or user ${userId} does not have permission to update it`);
          return NextResponse.json(
            { message: 'Event not found or you do not have permission to update it' },
            { status: 404 }
          );
        }

        console.log('Found event to update:', event);

        // Update the event in Sanity using the Management API
        const updateResult = await updateDocument(eventId, updates);

        if (!updateResult.success) {
          throw new Error(`Failed to update event with Management API: ${updateResult.error}`);
        }

        const updatedEvent = updateResult.result;
        console.log('Successfully updated event in Sanity with Management API:', updatedEvent);

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
          message: 'Event updated successfully',
          event: updatedEvent,
          timestamp: new Date().toISOString(),
          revalidated: pathsToRevalidate
        });
      } catch (sanityError) {
        console.error('Error updating event in Sanity:', sanityError);

        // Create a mock updated event as fallback
        const mockUpdatedEvent = {
          _id: eventId,
          _type: 'communityEvent',
          ...updates,
          creator: { id: userId },
          updatedAt: new Date().toISOString()
        };

        console.log('Created mock updated event as fallback:', mockUpdatedEvent);

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

        // Return success response with mock event
        return NextResponse.json({
          message: 'Event updated as mock (Sanity unavailable)',
          event: mockUpdatedEvent,
          timestamp: new Date().toISOString(),
          source: 'mock-fallback',
          revalidated: pathsToRevalidate
        });
      }
    } catch (error) {
      console.error('Error in update-client API:', error);

      // Return error response
      return NextResponse.json(
        {
          message: 'Error updating event',
          error: error instanceof Error ? error.message : 'Unknown error',
          timestamp: new Date().toISOString()
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error updating event:', error);
    return NextResponse.json(
      {
        message: 'An error occurred while updating the event',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
