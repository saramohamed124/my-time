'use client'; // Required for contexts inside app/

import { createContext, useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/navigation';

// 1. Create Context
const AuthContext = createContext();

// 2. Create Provider
export const AuthProvider = ({ children }) => {
  const router = useRouter();
  const [user, setUser] = useState(null); // user = authenticated user
  const [loading, setLoading] = useState(true); // loading state

  useEffect(() => {
    // Load user from localStorage or cookie (on mount)
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);    
  }, []);

  const login = async (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    router.push('/dashboard'); // Redirect to dashboard or home
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// 3. Custom hook to access auth
export const useAuth = () => {
  return useContext(AuthContext);
};