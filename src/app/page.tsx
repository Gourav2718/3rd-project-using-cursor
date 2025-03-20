'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { isAuthenticated } from '@/lib/authClient';

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(isAuthenticated());
  }, []);

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <div className="relative h-[60vh] overflow-hidden">
        <Image 
          src="https://www.holidify.com/images/cmsuploads/compressed/shutterstock_1307889884_20191024175636.jpg" 
          alt="Maharashtra Forts"
          fill
          style={{ objectFit: 'cover' }}
          priority
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center text-white p-4">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-center mb-4">
            Guardians of Maharashtra
          </h1>
          <p className="text-xl sm:text-2xl text-center max-w-2xl mb-8">
            Explore the majestic forts of Maharashtra, symbols of courage and heritage
          </p>
          <Link 
            href="/dashboard" 
            className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-md text-lg font-medium transition duration-300"
          >
            Explore Forts
          </Link>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div>
            <h2 className="text-3xl font-bold mb-4 text-slate-800">Discover Historic Forts</h2>
            <p className="text-slate-600 mb-4">
              Maharashtra is home to over 350 forts, each with its own unique history and architecture. 
              These forts were built by various dynasties including the Marathas, who under the leadership 
              of Chhatrapati Shivaji Maharaj, established a powerful empire in the 17th century.
            </p>
            <p className="text-slate-600 mb-4">
              Many of these forts are perched on hills or situated along the coast, offering 
              spectacular views and a glimpse into the region's rich military history.
            </p>
            {isLoggedIn ? (
              <Link 
                href="/dashboard" 
                className="inline-block bg-amber-500 hover:bg-amber-600 text-white px-5 py-2 rounded-md font-medium mt-2"
              >
                View All Forts
              </Link>
            ) : (
              <div className="space-x-4">
                <Link 
                  href="/login" 
                  className="inline-block bg-amber-500 hover:bg-amber-600 text-white px-5 py-2 rounded-md font-medium mt-2"
                >
                  Login
                </Link>
                <Link 
                  href="/signup" 
                  className="inline-block bg-slate-700 hover:bg-slate-800 text-white px-5 py-2 rounded-md font-medium mt-2"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
          <div className="relative h-80 sm:h-96 rounded-lg overflow-hidden">
            <Image 
              src="https://www.holidify.com/images/cmsuploads/compressed/800px-Rajmachi_Fort_20180406110304.jpg" 
              alt="Fort View"
              fill
              style={{ objectFit: 'cover' }}
            />
          </div>
        </div>

        {/* Featured Forts Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-6 text-slate-800 text-center">Featured Forts</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredForts.map((fort) => (
              <div key={fort.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
                <div className="relative h-48">
                  <Image 
                    src={fort.imageUrl} 
                    alt={fort.name}
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-bold mb-2 text-slate-800">{fort.name}</h3>
                  <p className="text-sm text-slate-500 mb-2">{fort.location}</p>
                  <p className="text-slate-600 mb-4">{fort.description}</p>
                  <Link 
                    href="/dashboard" 
                    className="text-amber-600 hover:text-amber-800 font-medium"
                  >
                    Learn more →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

const featuredForts = [
  {
    id: 1,
    name: 'Raigad Fort',
    location: 'Raigad, Maharashtra',
    description: 'The capital fort of the Maratha Empire, where Chhatrapati Shivaji Maharaj was coronated.',
    imageUrl: 'https://www.holidify.com/images/cmsuploads/compressed/shutterstock_407563152_20190926111644.jpg'
  },
  {
    id: 2,
    name: 'Sinhagad Fort',
    location: 'Pune, Maharashtra',
    description: 'Previously known as Kondhana, this fort has witnessed many battles including the Battle of Sinhagad.',
    imageUrl: 'https://www.holidify.com/images/cmsuploads/compressed/shutterstock_1307889884_20191024175636.jpg'
  },
  {
    id: 3,
    name: 'Pratapgad Fort',
    location: 'Satara, Maharashtra',
    description: 'A mountain fort where the famous battle between Shivaji Maharaj and Afzal Khan took place.',
    imageUrl: 'https://www.holidify.com/images/cmsuploads/compressed/Pratapgad_Fort_20181008171849.jpg'
  }
];
