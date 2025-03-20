'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getUser, isAuthenticated } from '@/lib/authClient';
import Cookies from 'js-cookie';

interface Fort {
  _id: string;
  name: string;
  description: string;
  location: string;
  district: string;
  history: string;
  imageUrl: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [forts, setForts] = useState<Fort[]>([]);
  const [selectedFort, setSelectedFort] = useState<Fort | null>(null);
  const [formData, setFormData] = useState<Partial<Fort>>({
    name: '',
    description: '',
    location: '',
    district: '',
    history: '',
    imageUrl: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (!isAuthenticated()) {
          router.push('/admin/login');
          return;
        }

        const user = getUser();
        if (!user || !user.isAdmin) {
          setError('You must be an admin to access this page');
          router.push('/login');
          return;
        }

        setIsAdmin(true);
        fetchForts();
      } catch (err) {
        console.error('Error checking auth:', err);
        router.push('/admin/login');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const fetchForts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/forts');
      
      if (!response.ok) {
        throw new Error('Failed to fetch forts');
      }
      
      const data = await response.json();
      setForts(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectFort = (fort: Fort) => {
    setSelectedFort(fort);
    setFormData(fort);
    setIsEditing(true);
    setIsCreating(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCreateNew = () => {
    setSelectedFort(null);
    setFormData({
      name: '',
      description: '',
      location: '',
      district: '',
      history: '',
      imageUrl: '',
    });
    setIsEditing(false);
    setIsCreating(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    
    try {
      if (isEditing && selectedFort) {
        // Update existing fort
        const response = await fetch(`/api/forts/${selectedFort._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || 'Failed to update fort');
        }

        setMessage('Fort updated successfully!');
      } else if (isCreating) {
        // Create new fort
        const response = await fetch('/api/forts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || 'Failed to create fort');
        }

        setMessage('Fort created successfully!');
        setIsCreating(false);
      }

      // Refresh the fort list
      fetchForts();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setIsCreating(false);
    setSelectedFort(null);
    setError('');
    setMessage('');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-red-500">
          {error || 'You do not have permission to access this page'}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-extrabold text-slate-800">Admin Dashboard</h1>
          <button
            onClick={handleCreateNew}
            className="px-4 py-2 bg-amber-500 text-white rounded-md hover:bg-amber-600 font-semibold"
          >
            Create New Fort
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4 font-semibold">
            {error}
          </div>
        )}

        {message && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4 font-semibold">
            {message}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Fort List */}
          <div className="lg:col-span-1 bg-white rounded-lg shadow p-4 h-[calc(100vh-200px)] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Forts</h2>
            {forts.length === 0 ? (
              <p className="text-slate-500 font-medium">No forts found</p>
            ) : (
              <ul className="space-y-2">
                {forts.map((fort) => (
                  <li
                    key={fort._id}
                    className={`p-3 rounded-md cursor-pointer hover:bg-slate-100 ${
                      selectedFort?._id === fort._id ? 'bg-slate-200' : ''
                    }`}
                    onClick={() => handleSelectFort(fort)}
                  >
                    <h3 className="font-bold">{fort.name}</h3>
                    <p className="text-sm text-slate-500 font-medium">{fort.location}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Edit Form */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
            {!isEditing && !isCreating ? (
              <div className="flex flex-col items-center justify-center h-full">
                <p className="text-slate-500 mb-4 font-medium">Select a fort to edit or create a new one</p>
              </div>
            ) : (
              <form onSubmit={handleSave}>
                <h2 className="text-xl font-bold mb-4">
                  {isEditing ? `Edit ${selectedFort?.name}` : 'Create New Fort'}
                </h2>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 mb-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-slate-300 rounded-md font-medium"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">
                      Location
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-slate-300 rounded-md font-medium"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">
                      District
                    </label>
                    <input
                      type="text"
                      name="district"
                      value={formData.district}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-slate-300 rounded-md font-medium"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">
                      Image URL
                    </label>
                    <input
                      type="text"
                      name="imageUrl"
                      value={formData.imageUrl}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-slate-300 rounded-md font-medium"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-slate-700 mb-1">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-slate-300 rounded-md font-medium"
                      rows={3}
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-slate-700 mb-1">
                      History
                    </label>
                    <textarea
                      name="history"
                      value={formData.history}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-slate-300 rounded-md font-medium"
                      rows={5}
                      required
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-4 py-2 border border-slate-300 rounded-md text-slate-700 hover:bg-slate-50 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-amber-500 text-white rounded-md hover:bg-amber-600 font-semibold"
                  >
                    {isEditing ? 'Update Fort' : 'Create Fort'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 