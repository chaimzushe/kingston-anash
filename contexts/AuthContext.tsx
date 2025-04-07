"use client";

import React, { createContext, useContext, useState } from 'react';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: any;
  isLoading: boolean;
  isAuthenticated: boolean;
  isVerified: boolean;
  login: (email: string, password: string) => Promise<any>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  isVerified: false,
  login: async () => null,
  logout: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Mock login function - replace with actual implementation when next-auth is installed
  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      // This is a placeholder - in a real app, you would call your auth API
      console.log('Login attempted with:', email);

      // Simulate successful login
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);

      return { ok: true };
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  };

  // Mock logout function
  const logout = async () => {
    setUser(null);
    router.push('/');
  };

  const value = {
    user: user,
    isLoading,
    isAuthenticated: !!user,
    isVerified: false,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
