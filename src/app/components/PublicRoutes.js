'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import Loader from '../utils/Loaders/element/Loader';

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
        <div className='flex justify-center items-center h-screen'>
            <Loader />
        </div>
    )
    }

    return <>{children}</>;
}