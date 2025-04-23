import { NextRequest, NextResponse } from 'next/server';
import { sanityClient } from '@/lib/sanity';
import { requireAuth } from '@/lib/auth-utils';

export async function POST(request: NextRequest) {
  try {
    const authResult = await requireAuth(request);

    if (!authResult.success) {
      return authResult.response;
    }

    const userId = authResult.userId;

    const data = await request.json();

    // Validate required fields
    const requiredFields = ['title', 'location'];
    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 });
      }
    }

    // Prepare the document
    const doc: any = {
      _type: 'giveaway',
      title: data.title,
      description: data.description || 'No description provided',
      condition: 'Good', // Default condition
      category: 'Other', // Default category
      location: data.location,
      contactName: data.contactName || 'Anonymous',
      contactEmail: data.contactEmail || 'anonymous@example.com',
      contactPhone: data.contactPhone || null,
      postedDate: new Date().toISOString(),
      isAvailable: true,
      price: data.price || 0,
      isFree: data.isFree !== false, // Default to true if not specified
      tags: data.tags || [],
      userId: userId,
      userEmail: data.userEmail || 'anonymous@example.com',
    };

    // Handle image uploads separately as they need to be processed by Sanity
    // This is a placeholder - actual image upload will be handled in the frontend
    // and the image references will be passed in the request

    // For testing purposes, we'll skip the images field entirely
    // The Sanity schema allows this field to be optional
    // In a real implementation, we would upload images to Sanity and reference them here

    console.log('Attempting to create giveaway with document:', JSON.stringify(doc, null, 2));
    console.log('Sanity client config:', {
      projectId: sanityClient.config().projectId,
      dataset: sanityClient.config().dataset,
      apiVersion: sanityClient.config().apiVersion,
      hasToken: !!sanityClient.config().token,
    });

    try {
      const result = await sanityClient.create(doc);
      console.log('Giveaway created successfully:', result);
      return NextResponse.json({ success: true, id: result._id });
    } catch (createError) {
      console.error('Error creating document in Sanity:', createError);
      throw createError; // Re-throw to be caught by the outer catch block
    }
  } catch (error) {
    console.error('Error creating giveaway:', error);
    return NextResponse.json({
      error: 'Failed to create giveaway',
      details: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}
