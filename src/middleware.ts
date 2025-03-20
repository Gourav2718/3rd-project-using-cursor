import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Public paths that don't require authentication
  const isPublicPath = path === '/login' || path === '/signup' || path === '/' || 
                      path === '/admin/login' || path === '/admin/signup';
  
  // Get auth token from cookies for regular users
  const isAuthenticated = request.cookies.has('auth_token');
  
  // Admin routes - will be checked via localStorage on the client side
  const isAdminRoute = path.startsWith('/admin') && path !== '/admin/login' && path !== '/admin/signup';
  
  // Redirect to login if trying to access protected route while not authenticated
  if (!isAuthenticated && !isPublicPath && !path.startsWith('/api') && !isAdminRoute) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  // Redirect to dashboard if trying to access login or signup while authenticated
  if (isAuthenticated && (path === '/login' || path === '/signup')) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (API routes that handle authentication)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.png$).*)',
  ],
}; 