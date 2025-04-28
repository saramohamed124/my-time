'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';

const Navbar = () => {
  const router = useRouter()
  const { user, loading } = useAuth();
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login'); // Redirect if not authenticated
    }
  }, [user, loading, router]);

  if (loading) return <p>Loading...</p>;

  return (
    <nav className="bg-white flex items-center justify-center md:justify-between  flex-wrap gap-2 shadow-xl p-3">
      {/* Logo and App Name */}
      <section className="flex items-center">
        <img src="/favicon.png" alt="Logo" />
        <Link href="/" className="text-[#535FFD] text-2xl font-bold">وقتي</Link>
      </section>

      {/* Links (Sign Up and Login) */}
      {user ? (
        <section className='flex justify-center items-center gap-2'>
          <Link href='/dashboard' className='font-semibold hover:text-blue-600'>{user?.firstName} {user?.lastName}</Link>
          <Link href='/dashboard' className='bg-black text-white font-bold py-2 px-2 rounded-[50%]'>{user?.firstName.charAt(0)} {user?.lastName.charAt(0)}</Link>
          </section>
      ) : (
        <section className="flex gap-4">
        {/* Sign Up Button */}
        <Link
          href="/signup"
          className="bg-[#535FFD] text-white py-2 px-6 rounded hover:bg-[#1D2159] transition-all duration-300"
        >
          إنشاء حساب
        </Link>

        {/* Login Button */}
        <Link
          href="/login"
          className="border border-[#535FFD] text-[#535FFD] py-2 px-6 rounded hover:bg-[#535FFD]  hover:text-white transition-all duration-300"
        >
          تسجيل الدخول
        </Link>
      </section>

      )}
    </nav>
  );
}

export default Navbar;
