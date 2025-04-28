'use client';

import Navbar from '@/app/components/Navbar';
import Sidebar from './components/Sidebar';

export default function DashboardLayout({ children }) {
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
