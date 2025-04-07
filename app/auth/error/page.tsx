"use client";

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { PageHeader } from '@/components/layout';

export default function AuthError() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  let errorMessage = 'An error occurred during authentication.';
  
  if (error === 'CredentialsSignin') {
    errorMessage = 'Invalid email or password. Please try again.';
  } else if (error === 'AccessDenied') {
    errorMessage = 'You do not have permission to access this resource.';
  } else if (error === 'Verification') {
    errorMessage = 'Your account has not been verified yet. Please contact an administrator.';
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 pattern-overlay">
      <div className="max-w-md mx-auto">
        <PageHeader 
          title="Authentication Error"
          subtitle="There was a problem signing you in"
        />
        
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mt-8">
          <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 mb-6">
            <p className="text-red-700 dark:text-red-300">{errorMessage}</p>
          </div>
          
          <div className="flex flex-col space-y-4">
            <Link 
              href="/auth/signin" 
              className="px-4 py-2 bg-gradient-primary text-white font-medium rounded-md shadow-sm transition-all duration-200 hover:opacity-90 hover:shadow-md text-center"
            >
              Try Again
            </Link>
            
            <Link 
              href="/" 
              className="px-4 py-2 bg-white border border-gray-300 text-gray-700 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 font-medium rounded-md shadow-sm transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-600 text-center"
            >
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
