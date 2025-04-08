"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { identifyUser } from '../lib/logRocketUtils';

interface AuthContextType {
  user: any;
  isLoading: boolean;
  isAuthenticated: boolean;
  isVerified: boolean;
  isInitialized: boolean;
  login: (email: string, password: string) => Promise<any>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  isVerified: false,
  isInitialized: false,
  login: async () => null,
  logout: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Start with loading true
  const [isInitialized, setIsInitialized] = useState(false);
  const router = useRouter();

  // Check for existing session when the component mounts
  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch('/api/auth/session');

        if (response.ok) {
          const data = await response.json();
          setUser(data.user);

          // Identify the user in LogRocket if they're logged in
          if (data.user) {
            identifyUser(data.user._id, {
              name: data.user.name,
              email: data.user.email,
              role: data.user.role
            });
          }
        }
      } catch (error) {
        console.error('Failed to check session:', error);
      } finally {
        setIsLoading(false);
        setIsInitialized(true);
      }
    };

    checkSession();
  }, []);

  // Real login function that calls the API
  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);

      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Set the user in state
      setUser(data.user);

      // Identify the user in LogRocket
      identifyUser(data.user._id, {
        name: data.user.name,
        email: data.user.email,
        role: data.user.role
      });

      return { ok: true, user: data.user };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Real logout function that calls the API
  const logout = async () => {
    try {
      setIsLoading(true);

      // Call the logout API
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Clear the user from state
      setUser(null);

      // Reset the LogRocket identity
      identifyUser('anonymous-user');

      // Redirect to home page
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user: user,
    isLoading,
    isAuthenticated: !!user,
    isVerified: user ? user.isVerified : false,
    isInitialized,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
