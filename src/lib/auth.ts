import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export function signToken(userId: string) {
  return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: '30d' });
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

// Cookie setting is now done via response objects, not directly
// These functions are for reference but aren't directly used in the updated flow
export function createResponseWithAuthCookie(token: string) {
  const response = NextResponse.json({ success: true });
  response.cookies.set('token', token, {
    httpOnly: true,
    path: '/',
    secure: process.env.NODE_ENV !== 'development',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  });
  return response;
}

export function createResponseWithDeletedAuthCookie() {
  const response = NextResponse.json({ success: true });
  response.cookies.delete('token');
  return response;
}

// For server components that need to check the token
export function getAuthCookieFromRequestCookies() {
  // This is used on the server side
  const cookieStore = cookies();
  return cookieStore.get('token');
}

export async function isAuthenticated(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  
  if (!token) {
    return null;
  }
  
  const decoded = verifyToken(token);
  return decoded;
}

export function protectRoute(handler: Function) {
  return async (request: NextRequest) => {
    // For development, bypass authentication
    if (process.env.NODE_ENV === 'development') {
      console.log('Development mode: Bypassing authentication protection');
      return handler(request, { id: 'dev-user' });
    }
    
    const user = await isAuthenticated(request);
    
    if (!user) {
      return NextResponse.json({ error: 'Not authorized, no token' }, { status: 401 });
    }
    
    return handler(request, user);
  };
} 