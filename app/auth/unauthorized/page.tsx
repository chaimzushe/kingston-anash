"use client";

import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';

export default function UnauthorizedPage() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [status, setStatus] = useState<'loading' | 'pending' | 'unauthorized'>('loading');
  const [message, setMessage] = useState('Checking your account status...');

  useEffect(() => {
    // Simplified flow - just check if user is signed in
    if (isLoaded) {
      if (isSignedIn) {
        // If user is signed in, they should have access
        // This page should only be shown if there's an error
        setStatus('unauthorized');
        setMessage('There was an error accessing the requested page. Please try again or contact support if the issue persists.');
      } else {
        // User is not signed in
        setStatus('unauthorized');
        setMessage('You need to sign in to access this page.');
      }
    }
  }, [isLoaded, isSignedIn]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-gray-300 dark:border-gray-600 border-t-primary mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/30 mb-4">
            <svg className="h-6 w-6 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Access Restricted</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{message}</p>

          <div className="space-y-3">
            {status === 'pending' ? (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 p-4 rounded-r mb-4 text-left">
                <div className="flex">
                  <svg className="h-5 w-5 text-yellow-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300">
                    Your request is being reviewed. This usually takes 1-2 business days.
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-400 p-4 rounded-r mb-4 text-left">
                <div className="flex">
                  <svg className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    If you believe this is an error, please contact the administrator.
                  </p>
                </div>
              </div>
            )}

            <div className="space-y-3">
              <Link
                href="/"
                className="block w-full py-2 px-4 bg-primary text-white text-center font-medium rounded hover:bg-primary/90 transition-colors"
              >
                Return to Home
              </Link>

              {!isSignedIn && (
                <Link
                  href="/auth/signin"
                  className="block w-full py-2 px-4 bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200 text-center font-medium rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Sign In
                </Link>
              )}

              <a
                href="mailto:chaimzushe@gmail.com?subject=Kingston%20Anash%20Access%20Request&body=Hello,%0A%0AI%20would%20like%20to%20request%20access%20to%20the%20Kingston%20Anash%20community%20website.%0A%0AName:%20%0AEmail:%20%0APhone:%20%0A%0AThank%20you."
                className="block w-full py-2 px-4 bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200 text-center font-medium rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Email Request Access
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
