import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  // Get the path the user is trying to access
  const path = request.nextUrl.pathname;
  
  // Define paths that should be accessible only to authenticated users
  const isPrivatePath = path === '/dashboard' || path.startsWith('/dashboard/') || path.startsWith('/profile');
  
  // Define paths that should only be accessible to public (non-authenticated) users
  const isAuthPath = path === '/login' || path === '/signup';
  
  // Get the token from cookies
  const token = request.cookies.get('token')?.value;
  
  // If the user tries to access private paths without being authenticated
  if (isPrivatePath && !token) {
    // Redirect to login page
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  // If the user is authenticated and tries to access authentication pages
  if (isAuthPath && token) {
    // Redirect to dashboard page
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  
  // Otherwise, continue
  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}; 