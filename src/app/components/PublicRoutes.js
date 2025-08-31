'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import Loader from '../utils/Loaders/element/Loader';
import '../utils/Loaders/element/loader.css';

export default function PublicRoute({ children }) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && user) {
            router.push('/dashboard');
        }
    }, [user, loading, router]);

    if (loading || user) {
        return (
        <div className='flex justify-center items-center h-screen text-redirect'>
            <Loader />
            <div className="text" data-text="Redirecting..."></div>
        </div>
    )
    }

    return <>{children}</>;
}