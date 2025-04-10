import { NextRequest, NextResponse } from 'next/server';
import { sanityWriteClient } from '@/lib/sanity';
import { currentUser, clerkClient } from '@clerk/nextjs/server';

export async function POST(request: NextRequest) {
  try {
    // Check if user is authenticated
    const user = await currentUser();
    if (!user) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if the user has the 'member' role
    const userRole = user.publicMetadata.role;
    if (userRole !== 'member') {
      return NextResponse.json(
        { message: 'Only community members can create events' },
        { status: 403 }
      );
    }

    // Get the request body
    const { title, description, date, startTime, endTime, location, gender } = await request.json();

    // Validate required fields
    if (!title || !date || !startTime || !endTime || !location || !gender) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate time format (HH:MM)
    const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(startTime) || !timeRegex.test(endTime)) {
      return NextResponse.json(
        { message: 'Invalid time format. Please use HH:MM (24-hour format)' },
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

    // Create the event in Sanity
    const event = await sanityWriteClient.create({
      _type: 'communityEvent',
      title,
      description: description || '',
      date,
      startTime,
      endTime,
      location,
      gender,
      creator: {
        id: user.id,
        name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.username || 'Anonymous',
        email: user.emailAddresses[0]?.emailAddress || ''
      },
      createdAt: new Date().toISOString()
    });

    return NextResponse.json({
      message: 'Event created successfully',
      event
    });
  } catch (error) {
    console.error('Error creating community event:', error);
    return NextResponse.json(
      { message: 'An error occurred while creating the event' },
      { status: 500 }
    );
  }
}
