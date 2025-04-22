"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { PageHeader } from '@/components/layout';
import GiveawayCard from '@/components/giveaways/GiveawayCard';
import ImageGallery from '@/components/giveaways/ImageGallery';
import FallbackImage from '@/components/giveaways/FallbackImage';
import { Giveaway } from '@/types/giveaways';
import { useUser } from '@clerk/nextjs';

// Helper function to format dates
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return 'Today';
  } else if (diffDays === 1) {
    return 'Yesterday';
  } else if (diffDays < 7) {
    return `${diffDays} days ago`;
  } else if (diffDays < 30) {
    return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) > 1 ? 's' : ''} ago`;
  } else {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }
};

// Helper function removed as it's no longer needed

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
    isFree: true,
    imageUrl: 'https://images.unsplash.com/photo-1586683086816-c0d0fda82e7f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1586683086816-c0d0fda82e7f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1543164904-8ff92670e498?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1555447001-5c7a0b272d10?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    ]
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
    isFree: false,
    imageUrl: 'https://images.unsplash.com/photo-1530018607912-eff2daa1bac4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1530018607912-eff2daa1bac4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1577140917170-285929fb55b7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    id: '3',
    title: 'Men\'s Winter Coat Size L',
    description: 'Black winter coat, size large. Very warm, only worn for one season. Giving away because I received a new one as a gift.',
    condition: 'Like New',
    category: 'Clothing',
    location: 'Cedar Street',
    contactName: 'Moshe Katz',
    contactPhone: '(845) 555-1234',
    postedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    isAvailable: true,
    tags: ['Clothing', 'Men', 'Winter'],
    price: 25,
    isFree: false,
    imageUrl: 'https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: '4',
    title: 'Children\'s Books Collection',
    description: 'Collection of 15 children\'s books in excellent condition. Suitable for ages 3-8. Titles include popular Jewish stories and educational books.',
    condition: 'Like New',
    category: 'Books & Media',
    location: 'Kingston Heights',
    contactName: 'Miriam Shapiro',
    contactEmail: 'example@example.com',
    postedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    isAvailable: true,
    tags: ['Books', 'Children', 'Education'],
    price: 0,
    isFree: true,
    imageUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: '5',
    title: 'Microwave Oven',
    description: 'Working microwave oven, 1000W. Approximately 5 years old but works well. Dimensions: 20" x 12" x 16".',
    condition: 'Fair',
    category: 'Appliances',
    location: 'Kingston Heights',
    contactName: 'Yosef Greenberg',
    contactPhone: '(845) 555-5678',
    postedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    isAvailable: true,
    tags: ['Appliances', 'Kitchen', 'Electronics'],
    price: 0,
    isFree: true,
    imageUrl: 'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: '6',
    title: 'Boys\' Bicycle (Ages 8-12)',
    description: 'Blue boys\' bicycle suitable for ages 8-12. 20-inch wheels, hand brakes. Some scratches but rides well.',
    condition: 'Good',
    category: 'Sports & Outdoors',
    location: 'Cedar Street',
    contactName: 'Daniel Rosen',
    contactEmail: 'example@example.com',
    postedDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    isAvailable: false,
    tags: ['Sports', 'Children', 'Outdoor'],
    price: 30,
    isFree: false,
    imageUrl: 'https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  }
];

// Categories removed as filters are no longer needed

// Define view types
type ViewType = 'grid' | 'list';

// Define sort options
type SortOption = 'newest' | 'oldest' | 'price-low' | 'price-high' | 'alphabetical';

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

  // State for search
  const [searchQuery, setSearchQuery] = useState('');

  // State for view options
  const [viewType, setViewType] = useState<ViewType>('grid');
  const [sortBy, setSortBy] = useState<SortOption>('newest');

  // State for scroll position and animation
  const [isScrolled, setIsScrolled] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Search functionality is handled inline

  // Add scroll event listener with debouncing
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 100);
      setIsScrolling(true);

      // Clear any existing timer
      if (scrollTimerRef.current) {
        clearTimeout(scrollTimerRef.current);
      }

      // Set a new timer to detect when scrolling stops
      scrollTimerRef.current = setTimeout(() => {
        setIsScrolling(false);
      }, 500);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimerRef.current) {
        clearTimeout(scrollTimerRef.current);
      }
    };
  }, []);

  // Filter giveaways based on search query
  const filteredGiveaways = sampleGiveaways.filter((giveaway: Giveaway) => {

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        giveaway.title.toLowerCase().includes(query) ||
        giveaway.description.toLowerCase().includes(query) ||
        (giveaway.category ? giveaway.category.toLowerCase().includes(query) : false) ||
        giveaway.location.toLowerCase().includes(query) ||
        giveaway.tags?.some(tag => tag.toLowerCase().includes(query))
      );
    }

    return true;
  });

  // Sort giveaways based on selected sort option
  const sortedGiveaways = [...filteredGiveaways].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime();
      case 'oldest':
        return new Date(a.postedDate).getTime() - new Date(b.postedDate).getTime();
      case 'price-low':
        return (a.price || 0) - (b.price || 0);
      case 'price-high':
        return (b.price || 0) - (a.price || 0);
      case 'alphabetical':
        return a.title.localeCompare(b.title);
      default:
        return new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime();
    }
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
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8">
          <PageHeader
            title="Community Marketplace"
            subtitle="Browse items available from community members"
          />
          {/* Desktop Post Button */}


          <div className="hidden sm:block sm:mt-0">
            <Link
              href="/community/giveaways/new"
              className="bg-gradient-primary text-white font-semibold rounded-md shadow-sm hover:opacity-90 hover:shadow-md px-4 py-2 transition-all duration-200 flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              <span>Add New Listing</span>
            </Link>
          </div>

          {/* Mobile Add Button - Gmail Style with Animation */}
          <div className="sm:hidden fixed bottom-4 right-4 z-50">
            <div className="relative">
              <Link
                href="/community/giveaways/new"
                className={`bg-gradient-primary text-white rounded-full shadow-md flex items-center justify-center h-10 overflow-hidden transition-all duration-500 ease-out ${isScrolled && isScrolling ? 'w-[110px]' : 'w-10'}`}
                aria-label="Add New Item"
              >
                <div className="flex items-center justify-center w-10 h-10 absolute left-0">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div
                  className={`ml-10 pr-3 transition-all duration-500 ease-out ${isScrolled && isScrolling ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}
                >
                  <span className="font-medium text-sm whitespace-nowrap">New Item</span>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Search and View Options */}
        <div className="sticky top-16 z-10 bg-white dark:bg-gray-800 rounded-lg p-3 sm:p-4 mb-6 transition-all duration-300">
          <div className="flex flex-col gap-3 sm:gap-4">
            {/* Search */}
            <div className="relative w-full">
              <input
                type="text"
                id="search"
                className="w-full h-10 px-3 py-1.5 pl-9 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white transition-all duration-300 text-sm sm:text-base"
                placeholder="Search items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                <svg className="h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer text-gray-400 hover:text-gray-600"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </button>
              )}
            </div>

            {/* View and Sort Options */}
            <div className="flex items-center justify-between">
              {/* View Type Toggle */}
              <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-md p-1">
                <button
                  onClick={() => setViewType('grid')}
                  className={`p-1 rounded-md ${viewType === 'grid' ? 'bg-white dark:bg-gray-600' : 'text-gray-500 dark:text-gray-400'} cursor-pointer`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
                <button
                  onClick={() => setViewType('list')}
                  className={`p-1 rounded-md ${viewType === 'list' ? 'bg-white dark:bg-gray-600' : 'text-gray-500 dark:text-gray-400'} cursor-pointer`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>

              {/* Sort Dropdown */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="appearance-none bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 py-1.5 px-2 sm:py-2 sm:px-4 pr-7 sm:pr-8 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary cursor-pointer text-xs sm:text-sm"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="alphabetical">Alphabetical</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-1.5 sm:px-2 text-gray-700 dark:text-gray-300">
                  <svg className="fill-current h-3 w-3 sm:h-4 sm:w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Filters removed as requested */}
        </div>

        {/* Results Count */}
        <div className="flex justify-between items-center mb-4">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Showing <span className="font-medium">{sortedGiveaways.length}</span> {sortedGiveaways.length === 1 ? 'item' : 'items'}
          </div>
        </div>

        {/* Giveaways Display */}
        {sortedGiveaways.length > 0 ? (
          viewType === 'grid' ? (
            // Grid View
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedGiveaways.map((giveaway) => (
                <GiveawayCard key={giveaway.id} giveaway={giveaway} />
              ))}
            </div>
          ) : (
            // List View
            <div className="space-y-4">
              {sortedGiveaways.map((giveaway) => (
                <div key={giveaway.id} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-sm transition-all duration-300 flex flex-col sm:flex-row">
                  {/* Image Gallery */}
                  <div className="relative h-48 sm:h-auto sm:w-48 flex-shrink-0">
                    {giveaway.images && giveaway.images.length > 0 ? (
                      <div className="h-full w-full relative">
                        <ImageGallery
                          images={giveaway.images}
                          alt={giveaway.title}
                        />
                        {!giveaway.isAvailable && (
                          <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center z-10">
                            <span className="text-white font-bold text-lg">TAKEN</span>
                          </div>
                        )}
                      </div>
                    ) : giveaway.imageUrl ? (
                      <div className="h-full w-full relative">
                        <Image
                          src={giveaway.imageUrl}
                          alt={giveaway.title}
                          fill
                          className="object-cover"
                          onError={(e) => {
                            // Replace with fallback image
                            const target = e.target as HTMLElement;
                            if (target.parentElement) {
                              const fallback = document.createElement('div');
                              fallback.className = 'h-full w-full';
                              fallback.appendChild(document.createElement('div'));
                              target.parentElement.replaceChild(fallback, target);

                              // Render fallback component
                              const fallbackDiv = fallback.firstChild as HTMLElement;
                              fallbackDiv.className = 'h-full w-full bg-gray-100 dark:bg-gray-700 flex flex-col items-center justify-center';

                              // Add icon
                              const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                              svg.setAttribute('class', 'h-12 w-12 text-gray-400 mb-2');
                              svg.setAttribute('fill', 'none');
                              svg.setAttribute('viewBox', '0 0 24 24');
                              svg.setAttribute('stroke', 'currentColor');

                              const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                              path.setAttribute('stroke-linecap', 'round');
                              path.setAttribute('stroke-linejoin', 'round');
                              path.setAttribute('stroke-width', '1.5');
                              path.setAttribute('d', 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z');

                              svg.appendChild(path);
                              fallbackDiv.appendChild(svg);

                              // Add title
                              const title = document.createElement('p');
                              title.className = 'text-xs text-gray-500 dark:text-gray-400 text-center px-2';
                              title.textContent = giveaway.title.length > 30 ? `${giveaway.title.substring(0, 30)}...` : giveaway.title;
                              fallbackDiv.appendChild(title);
                            }
                          }}
                        />
                        {!giveaway.isAvailable && (
                          <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
                            <span className="text-white font-bold text-lg">TAKEN</span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="h-full w-full">
                        <FallbackImage title={giveaway.title} />
                        {!giveaway.isAvailable && (
                          <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
                            <span className="text-white font-bold text-lg">TAKEN</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-5 flex-grow relative">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        {giveaway.title}
                      </h3>
                      <div>
                        {giveaway.price && giveaway.price > 0 ? (
                          <div className="bg-primary text-white px-3 py-1 rounded-full font-medium text-sm">
                            ${giveaway.price}
                          </div>
                        ) : (
                          <div className="bg-green-500 text-white px-3 py-1 rounded-full font-medium text-sm">
                            Free
                          </div>
                        )}
                      </div>
                    </div>

                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
                      {giveaway.description}
                    </p>

                    <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-300">
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span>{giveaway.location}</span>
                      </div>

                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>Posted {formatDate(giveaway.postedDate)}</span>
                      </div>
                    </div>

                    {/* Tags removed as requested */}

                    {/* Contact Info */}
                    {giveaway.isAvailable && (
                      <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700">
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          Contact: {giveaway.contactName}
                        </p>
                        {giveaway.contactEmail && (
                          <p className="text-sm text-primary">
                            <a href={`mailto:${giveaway.contactEmail}`} className="hover:underline">
                              {giveaway.contactEmail}
                            </a>
                          </p>
                        )}
                        {giveaway.contactPhone && (
                          <p className="text-sm text-primary">
                            <a href={`tel:${giveaway.contactPhone.replace(/[^0-9]/g, '')}`} className="hover:underline">
                              {giveaway.contactPhone}
                            </a>
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-8 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <p className="text-gray-500 dark:text-gray-400 text-lg font-medium">No items found matching your search.</p>
            <p className="mt-2 text-gray-500 dark:text-gray-400">Try a different search term or check back later.</p>
            <button
              onClick={() => setSearchQuery('')}
              className="mt-4 px-4 py-2 bg-white dark:bg-gray-700 text-primary border border-primary hover:bg-primary hover:text-white rounded-md text-sm font-medium transition-colors duration-200 cursor-pointer"
            >
              Clear Search
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
