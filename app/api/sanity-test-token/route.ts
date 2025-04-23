import { NextRequest, NextResponse } from 'next/server';
import { sanityClient } from '@/lib/sanity';

export async function GET(request: NextRequest) {
  try {
    // Log the Sanity configuration
    const sanityConfig = sanityClient.config();
    const token = sanityConfig.token || '';

    const config = {
      projectId: sanityConfig.projectId,
      dataset: sanityConfig.dataset,
      apiVersion: sanityConfig.apiVersion,
      hasToken: !!token,
      tokenFirstChars: token ? token.substring(0, 5) + '...' : 'none',
    };

    console.log('Sanity config:', config);

    // Try to create a test document
    const testDoc = {
      _type: 'giveaway',
      title: 'Test Giveaway ' + new Date().toISOString(),
      description: 'This is a test giveaway created to verify Sanity connection',
      condition: 'Good',
      category: 'Other',
      location: 'Test Location',
      contactName: 'Test User',
      contactEmail: 'test@example.com',
      contactPhone: '123-456-7890',
      postedDate: new Date().toISOString(),
      isAvailable: true,
      price: 0,
      isFree: true,
      tags: ['test'],
      userId: 'test-user-id',
      userEmail: 'test@example.com',
    };

    console.log('Attempting to create test document:', testDoc);

    try {
      const result = await sanityClient.create(testDoc);
      console.log('Test document created successfully:', result);

      return NextResponse.json({
        success: true,
        message: 'Successfully connected to Sanity and created a test document',
        config,
        result,
      });
    } catch (createError) {
      console.error('Error creating test document:', createError);

      return NextResponse.json({
        success: false,
        message: 'Failed to create test document in Sanity',
        error: createError instanceof Error ? createError.message : String(createError),
        config,
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Error in Sanity test route:', error);

    return NextResponse.json({
      success: false,
      message: 'Error in Sanity test route',
      error: error instanceof Error ? error.message : String(error),
    }, { status: 500 });
  }
}
