"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PageHeader } from '@/components/layout';

export default function LashonHaraPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;

    setIsSubmitting(true);

    // Simulate loading for dramatic effect
    setTimeout(() => {
      setShowAlert(true);
    }, 1500);
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 pattern-overlay">
      <div className="max-w-4xl mx-auto">
        <PageHeader
          title="Anonymous Chat Room"
          subtitle="A place to discuss... community matters"
        />

        {showAlert ? (
          <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
            <div className="text-4xl mb-6">🛑</div>
            <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">
              Lashon Hara is Forbidden!
            </h2>
            <p className="text-lg mb-6">
              Please find an occupation to do instead of engaging in Lashon Hara.
            </p>
            <div className="mb-8 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <p className="italic text-gray-700 dark:text-gray-300">
                "Before you speak, ask yourself: Is it kind, is it necessary, is it true, does it improve the silence?"
              </p>
              <p className="mt-2 text-right text-sm text-gray-600 dark:text-gray-400">
                — Shirdi Sai Baba
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="font-medium text-gray-900 dark:text-white">Instead, why not try:</h3>
              <ul className="text-left space-y-2 max-w-md mx-auto">
                <li className="flex items-center">
                  <span className="mr-2 text-green-500">✓</span>
                  <span>Learning Torah</span>
                </li>
                <li className="flex items-center">
                  <span className="mr-2 text-green-500">✓</span>
                  <span>Helping someone in the community</span>
                </li>
                <li className="flex items-center">
                  <span className="mr-2 text-green-500">✓</span>
                  <span>Calling a friend to say something nice</span>
                </li>
                <li className="flex items-center">
                  <span className="mr-2 text-green-500">✓</span>
                  <span>Baking challah for Shabbat</span>
                </li>
                <li className="flex items-center">
                  <span className="mr-2 text-green-500">✓</span>
                  <span>Literally anything else</span>
                </li>
              </ul>
            </div>
            <button
              onClick={() => router.push('/community')}
              className="mt-8 px-6 py-3 bg-primary text-white font-medium rounded-md shadow-md hover:bg-primary/90 transition-all duration-200 cursor-pointer"
            >
              Go Back to Community
            </button>
          </div>
        ) : (
          <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="max-w-md mx-auto">
              <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-blue-700 dark:text-blue-300">
                  <span className="font-medium">Note:</span> This chat room is anonymous. Please choose a username that doesn't reveal your identity.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Choose an Anonymous Username
                  </label>
                  <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                    placeholder="e.g., SecretWhisperer123"
                    required
                  />
                </div>

                <div className="flex items-center">
                  <input
                    id="terms"
                    name="terms"
                    type="checkbox"
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                    required
                  />
                  <label htmlFor="terms" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                    I understand that what happens in the chat room stays in the chat room
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary cursor-pointer ${
                    isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Entering Chat...
                    </>
                  ) : (
                    'Continue to Chat Room'
                  )}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
