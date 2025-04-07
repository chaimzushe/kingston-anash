import { NextResponse } from 'next/server';

export async function GET() {
  // Set cache control headers to prevent caching
  const headers = {
    'Cache-Control': 'no-store, max-age=0',
    'Pragma': 'no-cache',
    'Expires': '0',
  };

  // Return the current build ID
  return NextResponse.json(
    { buildId: process.env.NEXT_PUBLIC_BUILD_TIME || Date.now().toString() },
    { headers }
  );
}
