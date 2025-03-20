'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { isAuthenticated, logout } from '@/lib/authClient';

export default function Navbar() {
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  useEffect(() => {
    setIsLoggedIn(isAuthenticated());
  }, [pathname]);
  
  const handleLogout = () => {
    logout();
    setIsLoggedIn(false);
  };
  
  return (
    <nav className="bg-slate-800 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <span className="font-bold text-xl">Guardians of Maharashtra</span>
            </Link>
          </div>
          
          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-4">
            <Link 
              href="/" 
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                pathname === '/' ? 'bg-slate-900 text-white' : 'text-gray-300 hover:bg-slate-700'
              }`}
            >
              Home
            </Link>
            
            {isLoggedIn && (
              <Link 
                href="/admin" 
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  pathname === '/admin' ? 'bg-slate-900 text-white' : 'text-gray-300 hover:bg-slate-700'
                }`}
              >
                Admin
              </Link>
            )}
            
            {isLoggedIn ? (
              <>
                <Link 
                  href="/dashboard" 
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    pathname === '/dashboard' ? 'bg-slate-900 text-white' : 'text-gray-300 hover:bg-slate-700'
                  }`}
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-slate-700"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link 
                  href="/login" 
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    pathname === '/login' ? 'bg-slate-900 text-white' : 'text-gray-300 hover:bg-slate-700'
                  }`}
                >
                  Login
                </Link>
                <Link 
                  href="/signup" 
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    pathname === '/signup' ? 'bg-slate-900 text-white' : 'text-gray-300 hover:bg-slate-700'
                  }`}
                >
                  Sign Up
                </Link>
                <Link 
                  href="/admin/login" 
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    pathname === '/admin/login' ? 'bg-slate-900 text-white' : 'text-gray-300 hover:bg-slate-700'
                  }`}
                >
                  Admin Login
                </Link>
              </>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-300 hover:text-white hover:bg-slate-700 focus:outline-none"
            >
              <span className="sr-only">Open main menu</span>
              {/* Icon for menu */}
              <svg 
                className={`${isMobileMenuOpen ? 'hidden' : 'block'} h-6 w-6`} 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              {/* Icon for closing menu */}
              <svg 
                className={`${isMobileMenuOpen ? 'block' : 'hidden'} h-6 w-6`} 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      <div className={`${isMobileMenuOpen ? 'block' : 'hidden'} md:hidden`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <Link
            href="/"
            className={`block px-3 py-2 rounded-md text-base font-medium ${
              pathname === '/' ? 'bg-slate-900 text-white' : 'text-gray-300 hover:bg-slate-700'
            }`}
          >
            Home
          </Link>
          
          {isLoggedIn && (
            <Link 
              href="/admin" 
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                pathname === '/admin' ? 'bg-slate-900 text-white' : 'text-gray-300 hover:bg-slate-700'
              }`}
            >
              Admin
            </Link>
          )}
          
          {isLoggedIn ? (
            <>
              <Link
                href="/dashboard"
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  pathname === '/dashboard' ? 'bg-slate-900 text-white' : 'text-gray-300 hover:bg-slate-700'
                }`}
              >
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-slate-700"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  pathname === '/login' ? 'bg-slate-900 text-white' : 'text-gray-300 hover:bg-slate-700'
                }`}
              >
                Login
              </Link>
              <Link
                href="/signup"
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  pathname === '/signup' ? 'bg-slate-900 text-white' : 'text-gray-300 hover:bg-slate-700'
                }`}
              >
                Sign Up
              </Link>
              <Link 
                href="/admin/login" 
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  pathname === '/admin/login' ? 'bg-slate-900 text-white' : 'text-gray-300 hover:bg-slate-700'
                }`}
              >
                Admin Login
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
} 