'use client';
import { Roboto, Roboto_Mono } from "next/font/google";
import "./globals.css";
import { Provider } from 'react-redux';
import store from "@/lib/store";
import { metadata } from "./components/metadata";
import { AuthProvider, useAuth } from '@/app/context/AuthContext'
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const robotoSans = Roboto({
  variable: "--font-roboto-sans",
  subsets: ["latin"],
});

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  const router = useRouter();
  // const { user, loading } = useAuth();
  // useEffect(() => {
  //   // Redirect to login if user is not authenticated
  //   if (!loading && !user) {
  //     router.push('/login');
  //   }else if (user && router.pathname === '/login') {
  //     router.push('/dashboard'); // Redirect to dashboard if user is authenticated and on login page
  //   }
  // }, [user, loading, router]);

  return (
    <Provider store={store}>  {/* Wrap the entire app with Redux provider */}
    <html lang="ar" dir="rtl">
      <head>
        <link rel="icon" href='/favicon.png' type="image/png" />
        <title>{metadata.title}</title>
      </head>
      <body className={`${robotoSans.variable} ${robotoMono.variable} antialiased`}>
        <AuthProvider>
        {children}
        </AuthProvider>
      </body>
    </html>
    </Provider>
      );
}
