"use client";

import React from 'react';
import { useUser } from '@clerk/nextjs';
import { PageHeader } from '@/components/layout';
import Link from 'next/link';

export default function PendingApprovalPage() {
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 pattern-overlay">
      <div className="max-w-md mx-auto">
        <PageHeader
          title="Membership Pending"
          subtitle="Your account is awaiting approval"
        />
        
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mt-8">
          <div className="space-y-6">
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 p-4">
              <p className="text-yellow-700 dark:text-yellow-300">
                Thank you for registering, {user?.firstName || user?.username || 'User'}! Your account has been created, but you need administrator approval to access the community features.
              </p>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">What happens next?</h3>
              <ol className="list-decimal pl-5 space-y-2 text-gray-700 dark:text-gray-300">
                <li>An administrator has been notified of your registration.</li>
                <li>They will review your account and grant you access if approved.</li>
                <li>You'll be able to access community features once approved.</li>
                <li>This process usually takes 1-2 business days.</li>
              </ol>
            </div>
            
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                If you have any questions or need immediate assistance, please contact us.
              </p>
              
              <div className="flex flex-col space-y-3">
                <Link
                  href="/"
                  className="px-4 py-2 bg-gradient-primary text-white font-medium rounded-md shadow-sm transition-all duration-200 hover:opacity-90 hover:shadow-md text-center"
                >
                  Return to Home
                </Link>
                
                <Link
                  href="/profile"
                  className="px-4 py-2 bg-white border border-gray-300 text-gray-700 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 font-medium rounded-md shadow-sm transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-600 text-center"
                >
                  View Your Profile
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
