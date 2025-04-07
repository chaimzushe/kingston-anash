"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PageHeader } from '@/components/layout';
import GiveawayCard from '@/components/giveaways/GiveawayCard';
import { dummyGiveaways } from '@/data/giveawaysData';
import { Giveaway } from '@/types/giveaways';
import { useAuth } from '@/contexts/AuthContext';

export default function GiveawaysPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  // Check authentication and redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/signin?callbackUrl=/community/giveaways');
    }
  }, [isAuthenticated, router]);

  // If not authenticated, show nothing while redirecting
  if (!isAuthenticated) {
    return null;
  }

  // State for filter
  const [showAvailableOnly, setShowAvailableOnly] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Get unique categories from giveaways
  const categories = Array.from(new Set(dummyGiveaways.map(g => g.category)));

  // Filter giveaways based on state
  const filteredGiveaways = dummyGiveaways.filter((giveaway: Giveaway) => {
    // Filter by availability
    if (showAvailableOnly && !giveaway.isAvailable) {
      return false;
    }

    // Filter by category
    if (selectedCategory && giveaway.category !== selectedCategory) {
      return false;
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        giveaway.title.toLowerCase().includes(query) ||
        giveaway.description.toLowerCase().includes(query) ||
        giveaway.tags?.some(tag => tag.toLowerCase().includes(query))
      );
    }

    return true;
  });

  // Sort giveaways by date (newest first)
  const sortedGiveaways = [...filteredGiveaways].sort((a, b) => {
    return new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime();
  });

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 pattern-overlay">
      <div className="max-w-7xl mx-auto">
        <PageHeader
          title="Community Giveaways"
          subtitle="Browse items available for free from community members"
        />

        {/* Filters */}
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Search
              </label>
              <input
                type="text"
                id="search"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                placeholder="Search by title, description, or tags"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Category Filter */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Category
              </label>
              <select
                id="category"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                value={selectedCategory || ''}
                onChange={(e) => setSelectedCategory(e.target.value || null)}
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Availability Filter */}
            <div className="flex items-end">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  checked={showAvailableOnly}
                  onChange={(e) => setShowAvailableOnly(e.target.checked)}
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  Show available items only
                </span>
              </label>
            </div>
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
