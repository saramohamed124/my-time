'use client';

import React, { useEffect } from 'react';
import Navbar from '@/app/components/Navbar';
import Sidebar from './components/Sidebar';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import Loader from '../utils/Loaders/element/Loader';
import '../utils/Loaders/element/loader.css';

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    // Redirect to login if user is not authenticated
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);
      if (loading || !user) {
        return(
        <div className='flex justify-center items-center h-screen'>
            <Loader />
            <div className="text" data-text="Redirecting..."></div>
        </div>
        )
    }
  return (
    <article>
      <Navbar />
      <section className="flex w-full">
        <Sidebar />
        <main className=" w-full p-6 mx-auto  max-h-screen overflow-y-scroll">
          {children}
        </main>
      </section>
    </article>
  );
}
