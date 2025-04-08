import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Check for authentication cookies
  const authCookie = request.cookies.get('__session') || request.cookies.get('__clerk_db_jwt');
  
  // Get all cookies for debugging
  const allCookies = request.cookies.getAll();
  const cookieNames = allCookies.map(cookie => cookie.name);
  
  if (authCookie) {
    return NextResponse.json({
      authenticated: true,
      message: 'User is authenticated',
      cookieFound: authCookie.name,
      allCookies: cookieNames
    });
  } else {
    return NextResponse.json({
      authenticated: false,
      message: 'User is not authenticated',
      allCookies: cookieNames
    });
  }
}
