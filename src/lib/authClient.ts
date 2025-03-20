import { jwtDecode } from 'jwt-decode';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export type User = {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  token: string;
  isAdmin?: boolean;
  exp?: number; // Expiration timestamp from JWT
  iat?: number; // Issued at timestamp
};

// Server-side cookie functions
export function setAuthCookie(token: string) {
  const response = NextResponse.next();
  response.cookies.set('auth_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 7 * 24 * 60 * 60 // 7 days
  });
  return response;
}

export function removeAuthCookie() {
  const response = NextResponse.next();
  response.cookies.delete('auth_token');
  return response;
}

// Client-side functions
export function setToken(token: string) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('token', token);
  }
}

export function getToken() {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
}

export function removeToken() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token');
  }
}

export function getUser() {
  const token = getToken();
  if (!token) return null;
  try {
    return jwtDecode<User>(token);
  } catch {
    return null;
  }
}

export function isTokenValid() {
  const user = getUser();
  if (!user) return false;
  
  const now = Date.now() / 1000;
  return typeof user.exp === 'number' && user.exp > now;
}

export function isAuthenticated() {
  return isTokenValid();
}

export function logout() {
  removeToken();
  // Make sure we clear the HTTP-only cookie by making a request to the server
  fetch('/api/logout', { method: 'POST' })
    .catch(err => console.error('Error logging out:', err))
    .finally(() => {
      window.location.href = '/login';
    });
}

export function setUser(user: User) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('user', JSON.stringify(user));
  }
}

export function removeUser() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('user');
  }
} 