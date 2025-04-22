"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PageHeader } from '@/components/layout';
import RideShareCard from '@/components/rideShare/RideShareCard';
import { RideShare } from '@/types/rideShare';
import { useUser } from '@clerk/nextjs';

// Helper function to create dates relative to today
const getRelativeDate = (dayOffset: number): string => {
  const date = new Date();
  date.setDate(date.getDate() + dayOffset);
  return date.toISOString().split('T')[0];
};

// Sample ride share data
const sampleRideShares: RideShare[] = [
  {
    id: '1',
    driverName: 'Moshe Cohen',
    origin: 'Kingston',
    destination: 'Brooklyn, NY',
    departureDate: getRelativeDate(1), // Tomorrow
    departureTime: '08:00',
    returnDate: getRelativeDate(1), // Same day return
    returnTime: '18:00',
    availableSeats: 3,
    pricePerSeat: 20,
    contactPhone: '(845) 555-1234',
    contactEmail: 'example@example.com',
    notes: 'Leaving from Kingston Heights. Will make stops in Monsey if needed.',
    isRoundTrip: true,
    vehicleType: 'SUV',
    postedDate: new Date().toISOString()
  },
  {
    id: '2',
    driverName: 'Sarah Goldberg',
    origin: 'Kingston',
    destination: 'Monsey, NY',
    departureDate: getRelativeDate(2), // Day after tomorrow
    departureTime: '10:30',
    availableSeats: 2,
    pricePerSeat: 15,
    contactPhone: '(845) 555-5678',
    notes: 'Leaving from downtown Kingston. No stops along the way.',
    isRoundTrip: false,
    vehicleType: 'Sedan',
    postedDate: new Date().toISOString()
  }
];

export default function RideSharePage() {
  const router = useRouter();
  const { isSignedIn, isLoaded } = useUser();

  // Client-side authentication check as a backup
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      console.log('User not signed in, redirecting to sign-in page');
      router.push('/auth/signin?redirect_url=/community/ride-share');
    }
  }, [isLoaded, isSignedIn, router]);

  // State for filters
  const [destination, setDestination] = useState<string>('');
  const [showPastRides, setShowPastRides] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>('');

  // Get unique destinations from rides
  const destinations = Array.from(new Set(sampleRideShares.map(ride => ride.destination)));

  // Filter rides based on state
  const filteredRides = sampleRideShares.filter((ride: RideShare) => {
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

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 pattern-overlay">
      <div className="max-w-7xl mx-auto">
        <PageHeader
          title="Community Ride Share"
          subtitle="Find rides or offer seats in your vehicle for community members"
        />

        {/* Filters */}
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Destination Filter */}
            <div>
              <label htmlFor="destination" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Destination
              </label>
              <select
                id="destination"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
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
            </div>

            {/* Date Filter */}
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Departure Date
              </label>
              <input
                type="date"
                id="date"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>

            {/* Show Past Rides */}
            <div className="flex items-end">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded cursor-pointer"
                  checked={showPastRides}
                  onChange={(e) => setShowPastRides(e.target.checked)}
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  Show past rides
                </span>
              </label>
            </div>
          </div>

          {/* Reset Filters Button */}
          <div className="mt-4 flex justify-end">
            <button
              onClick={() => {
                setDestination('');
                setSelectedDate('');
                setShowPastRides(false);
              }}
              className="px-4 py-2 text-sm font-medium text-primary hover:text-primary/80 focus:outline-none cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        </div>

        {/* Results Count */}
        <div className="mt-6 text-sm text-gray-600 dark:text-gray-400">
          Showing {sortedRides.length} {sortedRides.length === 1 ? 'ride' : 'rides'}
        </div>

        {/* Add New Ride Button */}
        <div className="mt-2 flex justify-end">
          <button
            className="px-4 py-2 bg-primary text-white rounded-md shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary cursor-pointer"
          >
            Offer a Ride
          </button>
        </div>

        {/* Rides Grid */}
        {sortedRides.length > 0 ? (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedRides.map((ride) => (
              <RideShareCard key={ride.id} ride={ride} />
            ))}
          </div>
        ) : (
          <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-500 dark:text-gray-400">No rides found matching your criteria.</p>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Try adjusting your filters or check back later.</p>
          </div>
        )}
      </div>
    </div>
  );
}
