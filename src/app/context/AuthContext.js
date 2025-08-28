'use client';

import { createContext, useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/navigation';

const AuthContext = createContext();

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
    const userToStore = { ...userData };
    delete userToStore.password; // Remove password before storing
    setUser(userToStore);
    localStorage.setItem('user', JSON.stringify(userToStore));
    router.push('/dashboard');
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

export const useAuth = () => {
  return useContext(AuthContext);
};