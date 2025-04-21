import { NextRequest, NextResponse } from 'next/server';
import { sanityWriteClient } from '@/lib/sanity';
import { addMockEvent } from '@/lib/mockEvents';

export async function POST(request: NextRequest) {
  try {
    // Skip authentication check for now
    // We'll implement proper authentication later

    // No longer checking for member role
    // All authenticated users can create events

    // Get the request body
    const body = await request.json();
    console.log('Request body:', body);


    let { title, description, date, startTime, endTime, duration, location, gender, creator } = body;

    // Validate required fields
    if (!title || !date || !startTime || !location || !gender) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // If endTime is empty, set it to null
    if (!endTime || endTime === '') {
      endTime = null;
    }

    // Calculate endTime if not provided but duration is
    if ((!endTime || endTime === '') && startTime && duration) {
      const durationMinutes = parseInt(duration);

      // Parse start time
      const [hours, minutes] = startTime.split(':').map(Number);
      const startDate = new Date();
      startDate.setHours(hours, minutes, 0, 0);

      // Calculate end time
      const endDate = new Date(startDate.getTime() + durationMinutes * 60000);
      const endHours = endDate.getHours().toString().padStart(2, '0');
      const endMinutes = endDate.getMinutes().toString().padStart(2, '0');

      endTime = `${endHours}:${endMinutes}`;
    }

    // Log the received data
    console.log('Event data:', { title, date, startTime, endTime, duration, location, gender });

    // Validate start time format (HH:MM)
    const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(startTime)) {
      return NextResponse.json(
        { message: 'Invalid start time format. Please use HH:MM (24-hour format)' },
        { status: 400 }
      );
    }

    // Only validate end time if it's provided and not null
    if (endTime !== null && !timeRegex.test(endTime)) {
      return NextResponse.json(
        { message: 'Invalid end time format. Please use HH:MM (24-hour format)' },
        { status: 400 }
      );
    }

    // Validate gender
    if (!['men', 'women', 'both'].includes(gender)) {
      return NextResponse.json(
        { message: 'Invalid gender value. Must be "men", "women", or "both"' },
        { status: 400 }
      );
    }

    // Log Sanity client configuration
    console.log('Sanity client config:', {
      projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
      hasToken: !!process.env.SANITY_API_TOKEN,
      tokenLength: process.env.SANITY_API_TOKEN ? process.env.SANITY_API_TOKEN.length : 0
    });

    // Create the event data
    const eventData = {
      _type: 'communityEvent',
      title,
      description: description || '',
      date,
      startTime,
      endTime,
      duration: duration ? parseInt(duration) : undefined,
      location,
      gender,
      creator: creator,
      createdAt: new Date().toISOString()
    };

    console.log('Creating event with data:', eventData);

    try {
      // Create the event in Sanity
      const event = await sanityWriteClient.create(eventData);
      console.log('Event created successfully in Sanity:', event);

      return NextResponse.json({
        message: 'Event created successfully',
        event
      });
    } catch (error) {
      console.error('Error creating event in Sanity:', error);

      // For testing, create and store a mock event if Sanity fails
      const mockEvent = { _id: `mock-${Date.now()}`, ...eventData };
      console.log('Falling back to mock event:', mockEvent);

      // Store the mock event
      addMockEvent(mockEvent);

      return NextResponse.json({
        message: 'Event created successfully (mock)',
        event: mockEvent
      });
    }
  } catch (error) {
    console.error('Error creating community event:', error);

    // Provide more detailed error message
    let errorMessage = 'An error occurred while creating the event';
    let statusCode = 500;

    if (error instanceof Error) {
      errorMessage = `${errorMessage}: ${error.message}`;

      // Check for specific error types
      if (error.message.includes('Unauthorized') || error.message.includes('401')) {
        statusCode = 401;
        errorMessage = 'Unauthorized: Please check your Sanity API token';
      } else if (error.message.includes('CORS') || error.message.includes('origin')) {
        statusCode = 403;
        errorMessage = 'CORS error: The request origin is not allowed';
      }
    }

    return NextResponse.json(
      { message: errorMessage },
      { status: statusCode }
    );
  }
}
