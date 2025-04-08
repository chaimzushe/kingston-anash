import { NextRequest, NextResponse } from 'next/server';

// Temporarily disabled webhook route to fix build issues
export async function POST(req: NextRequest) {
  // Return a 200 response
  return NextResponse.json({ success: true });
}
