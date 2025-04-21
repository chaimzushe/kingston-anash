import { NextRequest, NextResponse } from 'next/server';
import { sanityWriteClient } from '@/lib/sanity';
import { auth } from '@clerk/nextjs/server';
import { getMockEvents } from '@/lib/mockEvents';

export async function PATCH(request: NextRequest) {
  try {
    // Get the current user from Clerk
    const authResult = await auth();
    const userId = authResult?.userId;

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

    // Check if the event is a mock event (starts with 'mock-')
    if (eventId.startsWith('mock-')) {
      // Handle mock event update
      try {
        // Get current mock events
        const mockEvents = getMockEvents();

        // Find the event to verify ownership
        const eventIndex = mockEvents.findIndex(event => event._id === eventId);

        if (eventIndex === -1) {
          return NextResponse.json(
            { message: 'Event not found' },
            { status: 404 }
          );
        }

        // Verify the user owns this event
        if (mockEvents[eventIndex].creator?.id !== userId) {
          return NextResponse.json(
            { message: 'You do not have permission to update this event' },
            { status: 403 }
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
        const updatedEvent = {
          ...mockEvents[eventIndex],
          ...updates,
          // Ensure creator remains unchanged
          creator: mockEvents[eventIndex].creator
        };

        // Replace the event in the array
        mockEvents[eventIndex] = updatedEvent;

        // Save the updated events back to localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('mockEvents', JSON.stringify(mockEvents));
        }

        return NextResponse.json({
          message: 'Event updated successfully',
          event: updatedEvent
        });
      } catch (error) {
        console.error('Error updating mock event:', error);
        return NextResponse.json(
          { message: 'An error occurred while updating the mock event' },
          { status: 500 }
        );
      }
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
