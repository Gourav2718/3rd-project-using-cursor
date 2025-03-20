import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';

export type User = {
  _id: string;
  name: string;
  email: string;
  phone: string;
  token: string;
};

export function setToken(token: string) {
  localStorage.setItem('token', token);
  // Also set a client-side cookie for redundancy
  Cookies.set('token', token, { expires: 30, path: '/' });
}

export function getToken() {
  if (typeof window !== 'undefined') {
    const localToken = localStorage.getItem('token');
    const cookieToken = Cookies.get('token');
    
    // Prefer token from cookie (which will match the HTTP-only cookie)
    return cookieToken || localToken;
  }
  return null;
}

export function removeToken() {
  localStorage.removeItem('token');
  Cookies.remove('token');
}

export function setUser(user: User) {
  localStorage.setItem('user', JSON.stringify(user));
}

export function getUser(): User | null {
  if (typeof window !== 'undefined') {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      return JSON.parse(userStr);
    }
  }
  return null;
}

export function removeUser() {
  localStorage.removeItem('user');
}

export function isTokenValid() {
  const token = getToken();
  
  if (!token) {
    return false;
  }
  
  try {
    const decoded: any = jwtDecode(token);
    return decoded.exp * 1000 > Date.now();
  } catch (error) {
    return false;
  }
}

export function logout() {
  removeToken();
  removeUser();
  // Make sure we clear the HTTP-only cookie by making a request to the server
  fetch('/api/logout', { method: 'POST' })
    .catch(err => console.error('Error logging out:', err))
    .finally(() => {
      window.location.href = '/login';
    });
}

export function isAuthenticated() {
  // For development, return true to bypass authentication
  if (process.env.NODE_ENV === 'development') {
    console.log('Development mode: Bypassing client-side authentication check');
    return true;
  }
  
  return getUser() !== null && isTokenValid() && !!Cookies.get('token');
} 