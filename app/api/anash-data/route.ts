import { NextResponse } from 'next/server';
import { getAnashData } from '../../../lib/debugUtils';

/**
 * API endpoint that returns the anash.xlsx data as JSON
 * Access at /api/anash-data
 */
export async function GET() {
  try {
    const data = getAnashData();
    
    return NextResponse.json({
      success: true,
      count: data.length,
      data: data
    });
  } catch (error) {
    console.error('Error in anash-data API:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch anash data',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
