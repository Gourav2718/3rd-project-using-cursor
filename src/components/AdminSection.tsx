'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getUser } from '@/lib/authClient';

interface Fort {
  _id: string;
  name: string;
  description: string;
  location: string;
  district: string;
  history: string;
  imageUrl: string;
}

export default function AdminSection() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [forts, setForts] = useState<Fort[]>([]);
  const [selectedFort, setSelectedFort] = useState<Fort | null>(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const checkAdmin = () => {
      try {
        const user = getUser();
        if (user && user.isAdmin) {
          setIsAdmin(true);
          fetchForts();
        }
      } catch (err) {
        console.error('Error checking admin status:', err);
      } finally {
        setLoading(false);
      }
    };

    checkAdmin();
  }, []);

  const fetchForts = async () => {
    try {
      const response = await fetch('/api/forts');
      if (!response.ok) {
        throw new Error('Failed to fetch forts');
      }
      const data = await response.json();
      setForts(data);
    } catch (err: any) {
      console.error('Error fetching forts:', err);
    }
  };

  const handleSelectFort = (fort: Fort) => {
    setSelectedFort(fort);
  };

  if (loading) {
    return <div className="text-center py-4">Loading...</div>;
  }

  if (!isAdmin) {
    return null; // Don't show anything if not an admin
  }

  return (
    <div className="bg-amber-50 rounded-lg p-6 shadow-md">
      <h2 className="text-2xl font-bold text-slate-800 mb-4">Admin Quick Access</h2>
      <p className="mb-4 text-slate-600">
        As an admin, you can manage fort data directly. For full administrative capabilities, visit the admin dashboard.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <h3 className="font-semibold text-lg mb-2">Recently Added Forts</h3>
          <ul className="space-y-2">
            {forts.slice(0, 5).map((fort) => (
              <li 
                key={fort._id} 
                className="p-2 hover:bg-amber-100 cursor-pointer rounded"
                onClick={() => handleSelectFort(fort)}
              >
                {fort.name}
              </li>
            ))}
          </ul>
        </div>
        
        <div>
          {selectedFort ? (
            <div>
              <h3 className="font-semibold text-lg mb-2">{selectedFort.name}</h3>
              <p className="text-sm text-slate-500 mb-2">{selectedFort.location}, {selectedFort.district}</p>
              <p className="text-sm mb-4 line-clamp-3">{selectedFort.description}</p>
              <Link 
                href={`/admin/dashboard?fortId=${selectedFort._id}`}
                className="text-amber-600 hover:text-amber-800 text-sm font-medium"
              >
                Edit this fort →
              </Link>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-slate-500">Select a fort to view details</p>
            </div>
          )}
        </div>
      </div>
      
      <div className="flex justify-between">
        <Link 
          href="/admin/dashboard" 
          className="bg-amber-500 hover:bg-amber-600 text-white py-2 px-4 rounded-md inline-block"
        >
          Go to Admin Dashboard
        </Link>
        
        <Link 
          href="/admin/dashboard?new=true" 
          className="bg-slate-200 hover:bg-slate-300 text-slate-800 py-2 px-4 rounded-md inline-block"
        >
          Add New Fort
        </Link>
      </div>
    </div>
  );
} 