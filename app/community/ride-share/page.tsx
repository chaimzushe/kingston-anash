"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { PageHeader } from '@/components/layout';
import RideShareCard from '@/components/rideShare/RideShareCard';
import { RideShare } from '@/types/rideShare';
import { useUser } from '@clerk/nextjs';



export default function RideSharePage() {
  const router = useRouter();
  const { isSignedIn, isLoaded } = useUser();

  // State for rides data and loading
  const [rides, setRides] = useState<RideShare[]>([]);
  const [isLoadingRides, setIsLoadingRides] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State for filters
  const [destination, setDestination] = useState<string>('');
  const [showPastRides, setShowPastRides] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>('');

  // Fetch rides data
  useEffect(() => {
    const fetchRides = async () => {
      try {
        setIsLoadingRides(true);
        setError(null);

        const response = await fetch('/api/community/rides');

        if (!response.ok) {
          throw new Error('Failed to fetch rides');
        }

        const data = await response.json();
        setRides(data);
      } catch (err) {
        console.error('Error fetching rides:', err);
        setError('Failed to load rides. Please try again.');
      } finally {
        setIsLoadingRides(false);
      }
    };

    if (isSignedIn) {
      fetchRides();
    }
  }, [isSignedIn]);

  // Client-side authentication check as a backup
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      console.log('User not signed in, redirecting to sign-in page');
      router.push('/auth/signin?redirect_url=/community/ride-share');
    }
  }, [isLoaded, isSignedIn, router]);

  // Get unique destinations from rides
  const destinations = Array.from(new Set(rides.map(ride => ride.destination)));

  // Filter rides based on state
  const filteredRides = rides.filter((ride: RideShare) => {
    // Filter by destination
    if (destination && ride.destination !== destination) {
      return false;
    }

    // Filter by date
    if (selectedDate && ride.departureDate !== selectedDate) {
      return false;
    }

    // Filter past rides
    if (!showPastRides) {
      const today = new Date().toISOString().split('T')[0];
      if (ride.departureDate < today) {
        return false;
      }
    }

    return true;
  });

  // Sort rides by departure date (soonest first)
  const sortedRides = [...filteredRides].sort((a, b) => {
    return new Date(a.departureDate).getTime() - new Date(b.departureDate).getTime();
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
            href="/auth/signin?redirect_url=/community/ride-share"
            className="mt-4 inline-block px-6 py-3 bg-primary text-white rounded-md"
          >
            Sign In
          </a>
        </div>
      </div>
    );
  }

  // If loading rides data, show loading spinner
  if (isLoadingRides) {
    return (
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section with Background */}
          <div className="relative rounded-2xl overflow-hidden mb-12 bg-gradient-to-r from-primary to-blue-700 shadow-xl">
            <div className="absolute inset-0 bg-pattern opacity-10"></div>
            <div className="relative z-10 px-8 py-16 text-white">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Community Ride Share</h1>
              <p className="text-xl md:text-2xl max-w-2xl opacity-90">
                Find rides or offer seats in your vehicle for community members
              </p>
              <Link
                href="/community/ride-share/new"
                className="mt-8 px-6 py-3 bg-white text-primary font-bold rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                </svg>
                Offer a Ride
              </Link>
            </div>
          </div>

          <div className="flex justify-center items-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-400">Loading rides...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If there was an error loading rides, show error message
  if (error) {
    return (
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section with Background */}
          <div className="relative rounded-2xl overflow-hidden mb-12 bg-gradient-to-r from-primary to-blue-700 shadow-xl">
            <div className="absolute inset-0 bg-pattern opacity-10"></div>
            <div className="relative z-10 px-8 py-16 text-white">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Community Ride Share</h1>
              <p className="text-xl md:text-2xl max-w-2xl opacity-90">
                Find rides or offer seats in your vehicle for community members
              </p>
              <Link
                href="/community/ride-share/new"
                className="mt-8 px-6 py-3 bg-white text-primary font-bold rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                </svg>
                Offer a Ride
              </Link>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center">
            <div className="inline-block p-4 bg-red-100 dark:bg-red-900/20 rounded-full mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Error Loading Rides</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-primary text-white font-medium rounded-lg shadow hover:bg-primary-dark transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section with Background */}
        <div className="relative rounded-2xl overflow-hidden mb-12 bg-gradient-to-r from-primary to-blue-700 shadow-xl">
          <div className="absolute inset-0 bg-pattern opacity-10"></div>
          <div className="relative z-10 px-8 py-16 text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Community Ride Share</h1>
            <p className="text-xl md:text-2xl max-w-2xl opacity-90">
              Find rides or offer seats in your vehicle for community members
            </p>
            <Link
              href="/community/ride-share/new"
              className="mt-8 px-6 py-3 bg-white text-primary font-bold rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
              </svg>
              Offer a Ride
            </Link>
          </div>
        </div>

        {/* Filters Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8 transform hover:shadow-xl transition-all duration-300">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
            </svg>
            Filter Rides
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Destination Filter */}
            <div className="relative">
              <label htmlFor="destination" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Destination
              </label>
              <div className="relative">
                <select
                  id="destination"
                  className="w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white appearance-none"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                >
                  <option value="">All Destinations</option>
                  {destinations.map((dest) => (
                    <option key={dest} value={dest}>
                      {dest}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Date Filter */}
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Departure Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  id="date"
                  className="w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Show Past Rides */}
            <div className="flex items-end">
              <label className="inline-flex items-center cursor-pointer">
                <div className="relative">
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={showPastRides}
                    onChange={(e) => setShowPastRides(e.target.checked)}
                  />
                  <div className={`block w-14 h-8 rounded-full ${showPastRides ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
                  <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${showPastRides ? 'transform translate-x-6' : ''}`}></div>
                </div>
                <span className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Show past rides
                </span>
              </label>
            </div>
          </div>

          {/* Reset Filters Button */}
          <div className="mt-6 flex justify-end">
            <button
              onClick={() => {
                setDestination('');
                setSelectedDate('');
                setShowPastRides(false);
              }}
              className="px-4 py-2 text-sm font-medium text-primary hover:text-primary-dark focus:outline-none cursor-pointer flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
              </svg>
              Reset Filters
            </button>
          </div>
        </div>

        {/* Results Count and Sort */}
        <div className="flex justify-between items-center mb-6">
          <div className="text-sm font-medium text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800 px-4 py-2 rounded-lg shadow">
            Showing <span className="text-primary font-bold">{sortedRides.length}</span> {sortedRides.length === 1 ? 'ride' : 'rides'}
          </div>
        </div>

        {/* Rides Grid */}
        {sortedRides.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sortedRides.map((ride) => (
              <RideShareCard key={ride.id} ride={ride} />
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-12 text-center">
            <div className="inline-block p-4 bg-gray-100 dark:bg-gray-700 rounded-full mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No rides found</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">No rides match your current filter criteria.</p>
            <button
              onClick={() => {
                setDestination('');
                setSelectedDate('');
                setShowPastRides(false);
              }}
              className="px-6 py-3 bg-primary text-white font-medium rounded-lg shadow hover:bg-primary-dark transition-colors"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Floating Action Button for Mobile */}
        <div className="fixed bottom-6 right-6 md:hidden z-10">
          <Link href="/community/ride-share/new" className="w-14 h-14 rounded-full bg-primary text-white shadow-lg flex items-center justify-center hover:bg-primary-dark transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
