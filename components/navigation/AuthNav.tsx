"use client";

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

const AuthNav: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();

  const handleSignOut = async () => {
    await logout();
  };

  // If not authenticated, return an empty div
  if (!isAuthenticated) {
    return <div></div>;
  }

  // If authenticated, show the user menu
  return (
    <div className="flex items-center">
      <div className="relative group">
        <button className="flex items-center space-x-1 text-white hover:text-amber-200 transition-colors duration-150 font-medium">
          <span>{user?.name || 'Account'}</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        <div className="absolute right-0 mt-2 w-48 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-md shadow-md py-1 z-10 hidden group-hover:block border border-white/10 dark:border-gray-700/50">
          <Link
            href="/community"
            className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            Community Directory
          </Link>
          <button
            onClick={handleSignOut}
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthNav;
