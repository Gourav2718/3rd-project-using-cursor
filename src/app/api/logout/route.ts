import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Create response
    const response = NextResponse.json({ success: true });

    // Clear the token cookie
    response.cookies.delete('token');

    return response;
  } catch (error: any) {
    console.error('Error in logout:', error);
    return NextResponse.json(
      { error: error.message || 'An error occurred during logout' },
      { status: 500 }
    );
  }
} 