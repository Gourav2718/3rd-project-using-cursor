import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export interface JwtPayload {
  id: string;
  email?: string;
  role?: string;
  isAdmin?: boolean;
}

export function signToken(userId: string, isAdmin: boolean = false) {
  return jwt.sign({ 
    id: userId, 
    isAdmin 
  }, JWT_SECRET, { expiresIn: '30d' });
}

export function verifyToken(token: string): JwtPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    
    // For backward compatibility with existing tokens
    if (decoded.role === 'admin') {
      decoded.isAdmin = true;
    }
    
    return decoded;
  } catch (error) {
    return null;
  }
}

// Cookie setting is now done via response objects, not directly
// These functions are for reference but aren't directly used in the updated flow
export function createResponseWithAuthCookie(token: string) {
  const response = NextResponse.json({ success: true });
  response.cookies.set('auth_token', token, {
    httpOnly: true,
    path: '/',
    secure: process.env.NODE_ENV !== 'development',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  });
  return response;
}

export function createResponseWithDeletedAuthCookie() {
  const response = NextResponse.json({ success: true });
  response.cookies.delete('auth_token');
  return response;
}

// For server components that need to check the token
export async function getAuthCookieFromRequestCookies() {
  // This is used on the server side
  const cookieStore = await cookies();
  return cookieStore.get('auth_token');
}

export function isAuthenticated(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value;
  
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
    
    const user = isAuthenticated(request);
    
    if (!user) {
      return NextResponse.json({ error: 'Not authorized, no token' }, { status: 401 });
    }
    
    return handler(request, user);
  };
} 