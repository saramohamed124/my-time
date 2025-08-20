'use client';

import React, { useEffect } from 'react';
import Navbar from '@/app/components/Navbar';
import Sidebar from './components/Sidebar';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    // Redirect to login if user is not authenticated
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);
  return (
    <article>
      <Navbar />
      <section className="flex w-full">
        <Sidebar />
        <main className=" w-full p-6 mx-auto ">
          {children}
        </main>
      </section>
    </article>
  );
}
