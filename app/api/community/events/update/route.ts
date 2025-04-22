import { NextRequest, NextResponse } from 'next/server';
import { sanityWriteClient } from '@/lib/sanity';
import { auth } from '@clerk/nextjs/server';

export async function PATCH(request: NextRequest) {
  try {
    // Get the current user from Clerk
    const session = await auth();
    const userId = session.userId;

    if (!userId) {
      return NextResponse.json(
        { message: 'Authentication required' },
        { status: 401 }
      );
    }

    // Parse the request body
    const body = await request.json();
    const { eventId, ...updates } = body;

    if (!eventId) {
      return NextResponse.json(
        { message: 'Event ID is required' },
        { status: 400 }
      );
    }

    // We no longer support mock events
    if (eventId.startsWith('mock-')) {
      return NextResponse.json(
        { message: 'Mock events are no longer supported' },
        { status: 400 }
      );
    }

    // For Sanity events, first check if the event exists and belongs to the current user
    const query = `*[_type == "communityEvent" && _id == $eventId && creator.id == $userId][0]`;
    const event = await sanityWriteClient.fetch(query, { eventId, userId });

    if (!event) {
      return NextResponse.json(
        { message: 'Event not found or you do not have permission to update it' },
        { status: 404 }
      );
    }

    // Calculate endTime if startTime and duration are provided
    if (updates.startTime && updates.duration) {
      const [hours, minutes] = updates.startTime.split(':').map(Number);
      const startDate = new Date();
      startDate.setHours(hours, minutes, 0, 0);

      const endDate = new Date(startDate.getTime() + parseInt(updates.duration) * 60000);
      const endHours = endDate.getHours().toString().padStart(2, '0');
      const endMinutes = endDate.getMinutes().toString().padStart(2, '0');

      updates.endTime = `${endHours}:${endMinutes}`;
    }

    // Update the event
    const updatedEvent = await sanityWriteClient.patch(eventId)
      .set(updates)
      .commit();

    return NextResponse.json({
      message: 'Event updated successfully',
      event: updatedEvent
    });
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
