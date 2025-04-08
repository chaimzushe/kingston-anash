"use client";

import React from 'react';
import Link from 'next/link';
import { useUser, useClerk } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

const AuthNav: React.FC = () => {
  const { user, isSignedIn, isLoaded } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  // If not loaded or not signed in, return an empty div
  if (!isLoaded || !isSignedIn) {
    return null;
  }

  // If authenticated, show the user menu
  return (
    <div className="flex items-center">
      <div className="relative group">
        <button className="flex items-center space-x-1 text-white hover:text-amber-200 transition-colors duration-150 font-medium cursor-pointer">
          <span>{user?.firstName || user?.username || 'Account'}</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Invisible padding element to prevent hover gap */}
        <div className="absolute inset-x-0 h-2 bottom-0 transform translate-y-full"></div>

        <div className="absolute right-0 top-full w-48 pt-2 z-10 hidden group-hover:block transition-all duration-200 ease-in-out">
          <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-md shadow-md py-1 border border-white/10 dark:border-gray-700/50">
            <Link
              href="/profile"
              className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Profile
            </Link>

            <button
              onClick={handleSignOut}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthNav;
