'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getUser } from '@/lib/authClient';
import AdminSection from '@/components/AdminSection';

export default function AdminPage() {
  const router = useRouter();
  const user = getUser();

  useEffect(() => {
    // Redirect to home if user is not logged in
    if (!user) {
      router.push('/');
    }
  }, [user, router]);

  if (!user) {
    return null;
  }

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-slate-800 mb-8">Admin Dashboard</h1>
        <AdminSection />
      </div>
    </main>
  );
} 