"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PageHeader } from '@/components/layout';
import GiveawayCard from '@/components/giveaways/GiveawayCard';
import { Giveaway } from '@/types/giveaways';
import { useUser } from '@clerk/nextjs';

// Sample giveaways data
const sampleGiveaways: Giveaway[] = [
  {
    id: '1',
    title: 'Baby Crib with Mattress',
    description: 'Wooden baby crib in good condition. Includes mattress and two fitted sheets.',
    condition: 'Good',
    category: 'Baby & Kids',
    location: 'Kingston Heights',
    contactName: 'Sarah Goldstein',
    contactEmail: 'example@example.com',
    postedDate: new Date().toISOString(),
    isAvailable: true,
    tags: ['Furniture', 'Baby'],
    price: 0,
    isFree: true
  },
  {
    id: '2',
    title: 'Kitchen Table with 4 Chairs',
    description: 'Wooden kitchen table with four matching chairs. Some minor scratches but overall in good condition.',
    condition: 'Good',
    category: 'Furniture',
    location: 'Downtown Kingston',
    contactName: 'David Levy',
    contactEmail: 'example@example.com',
    postedDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    isAvailable: true,
    tags: ['Furniture', 'Kitchen'],
    price: 75,
    isFree: false
  }
];

export default function GiveawaysPage() {
  const router = useRouter();
  const { isSignedIn, isLoaded } = useUser();

  // Client-side authentication check as a backup
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      console.log('User not signed in, redirecting to sign-in page');
      router.push('/auth/signin?redirect_url=/community/giveaways');
    }
  }, [isLoaded, isSignedIn, router]);

  // State for filter
  const [showAvailableOnly, setShowAvailableOnly] = useState(true);
  const [showFreeOnly, setShowFreeOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Get unique categories from giveaways (for future use if needed)
  const categories = Array.from(new Set(sampleGiveaways.map(g => g.category)));

  // Filter giveaways based on state
  const filteredGiveaways = sampleGiveaways.filter((giveaway: Giveaway) => {
    // Filter by availability
    if (showAvailableOnly && !giveaway.isAvailable) {
      return false;
    }

    // Filter by price (free only)
    if (showFreeOnly && !giveaway.isFree) {
      return false;
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        giveaway.title.toLowerCase().includes(query) ||
        giveaway.description.toLowerCase().includes(query) ||
        giveaway.category.toLowerCase().includes(query) ||
        giveaway.location.toLowerCase().includes(query) ||
        giveaway.tags?.some(tag => tag.toLowerCase().includes(query))
      );
    }

    return true;
  });

  // Sort giveaways by date (newest first)
  const sortedGiveaways = [...filteredGiveaways].sort((a, b) => {
    return new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime();
  });

  // If still loading authentication status, show loading spinner
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, show a message
  if (!isSignedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-4">
            <p className="font-bold">Authentication Required</p>
            <p>You need to be signed in to access this page.</p>
          </div>
          <a
            href="/auth/signin?redirect_url=/community/giveaways"
            className="mt-4 inline-block px-6 py-3 bg-primary text-white rounded-md"
          >
            Sign In
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 pattern-overlay">
      <div className="max-w-7xl mx-auto">
        <PageHeader
          title="Community Marketplace"
          subtitle="Browse items available from community members"
        />

        {/* Filters */}
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6">
          {/* Search */}
          <div className="mb-4">
            <div className="relative">
              <input
                type="text"
                id="search"
                className="w-full px-4 py-3 pl-10 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                placeholder="Search items by keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>

          {/* Filter options */}
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded cursor-pointer"
                checked={showAvailableOnly}
                onChange={(e) => setShowAvailableOnly(e.target.checked)}
              />
              <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                Available items only
              </span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded cursor-pointer"
                checked={showFreeOnly}
                onChange={(e) => setShowFreeOnly(e.target.checked)}
              />
              <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                Free items only
              </span>
            </label>
          </div>
        </div>

        {/* Results Count */}
        <div className="mt-6 text-sm text-gray-600 dark:text-gray-400">
          Showing {sortedGiveaways.length} {sortedGiveaways.length === 1 ? 'item' : 'items'}
        </div>

        {/* Giveaways Grid */}
        {sortedGiveaways.length > 0 ? (
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedGiveaways.map((giveaway) => (
              <GiveawayCard key={giveaway.id} giveaway={giveaway} />
            ))}
          </div>
        ) : (
          <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-500 dark:text-gray-400">No items found matching your criteria.</p>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Try adjusting your filters or check back later.</p>
          </div>
        )}
      </div>
    </div>
  );
}
