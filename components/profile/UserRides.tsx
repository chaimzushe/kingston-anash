"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  CalendarIcon,
  MapPinIcon,
  PencilIcon,
  TrashIcon,
  ArrowPathIcon,
  MapIcon
} from '@heroicons/react/24/outline';
import { RideShare } from '@/types/rideShare';

interface UserRidesProps {
  limit?: number;
}

const UserRides: React.FC<UserRidesProps> = ({ limit }) => {
  const [rides, setRides] = useState<RideShare[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Fetch user's rides
  useEffect(() => {
    fetchUserRides();
  }, []);

  const fetchUserRides = async () => {
    try {
      setIsLoading(true);
      setError('');

      const response = await fetch('/api/community/rides/user');

      if (!response.ok) {
        throw new Error('Failed to fetch your rides');
      }

      const data = await response.json();
      setRides(data);
    } catch (error) {
      console.error('Error fetching rides:', error);
      setError('Failed to load your rides. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Delete a ride
  const handleDelete = async (id: string) => {
    try {
      setIsDeleting(true);
      setDeleteId(id);

      const response = await fetch(`/api/community/rides/delete?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete ride');
      }

      // Remove the deleted ride from the state
      setRides(rides.filter(ride => ride.id !== id));
    } catch (error) {
      console.error('Error deleting ride:', error);
      alert('Failed to delete ride. Please try again.');
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  // Check if ride is in the past
  const isPastRide = (departureDate: string) => {
    const today = new Date().toISOString().split('T')[0];
    return departureDate < today;
  };

  if (isLoading) {
    return (
      <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md">
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md">
        <div className="text-center py-8">
          <div className="text-red-500 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <button
            onClick={fetchUserRides}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (rides.length === 0) {
    return (
      <div className="p-6 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="text-center py-8">
          <div className="inline-block p-4 bg-gray-100 dark:bg-gray-700 rounded-full mb-4">
            <MapIcon className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No Rides Offered</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">You haven't offered any rides yet.</p>
          {!limit && (
            <Link
              href="/community/ride-share/new"
              className="px-4 py-2 bg-gradient-primary text-white rounded-full font-medium shadow-sm hover:shadow-md transition-all duration-200 transform hover:-translate-y-0.5 inline-flex items-center"
            >
              <MapIcon className="h-4 w-4 mr-2" />
              Offer a Ride
            </Link>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden">
      {!limit && (
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
            <MapIcon className="h-5 w-5 mr-2 text-primary" />
            Your Ride Offers
          </h2>
          <div className="flex space-x-2">
            <button
              onClick={fetchUserRides}
              className="p-2 text-gray-500 hover:text-primary rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
              title="Refresh"
            >
              <ArrowPathIcon className="w-5 h-5" />
            </button>
            <Link
              href="/community/ride-share/new"
              className="px-4 py-2 bg-gradient-primary text-white rounded-full font-medium shadow-sm hover:shadow-md transition-all duration-200 transform hover:-translate-y-0.5 inline-flex items-center"
            >
              <MapIcon className="h-4 w-4 mr-2" />
              Offer a Ride
            </Link>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {(limit ? rides.slice(0, limit) : rides).map((ride) => {
          const isPast = isPastRide(ride.departureDate);

          return (
            <div
              key={ride.id}
              className={`relative rounded-lg overflow-hidden transition-all duration-300 ${limit ? '' : 'hover:shadow-md transform hover:-translate-y-1'} ${
                isPast ? 'opacity-70' : ''
              }`}
            >
              {/* Colored top border based on ride type */}
              <div className="h-1.5 bg-gradient-to-r from-secondary to-primary w-full absolute top-0 left-0"></div>

              <div className="p-4 pt-5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <span className="font-medium text-gray-900 dark:text-white flex items-center">
                        <MapPinIcon className="w-5 h-5 text-primary mr-2" />
                        {ride.origin} → {ride.destination}
                      </span>
                      {isPast && (
                        <span className="ml-2 text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full">
                          Past
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-y-1 gap-x-4 text-sm">
                      <div className="flex items-center text-gray-600 dark:text-gray-300">
                        <CalendarIcon className="w-4 h-4 mr-1 text-primary/70" />
                        {formatDate(ride.departureDate)}
                      </div>

                      <div className="flex items-center text-gray-600 dark:text-gray-300">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-primary/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {ride.departureTime}
                      </div>

                      {ride.isRoundTrip && ride.returnDate && (
                        <div className="flex items-center text-gray-600 dark:text-gray-300">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-primary/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 15v-1a4 4 0 00-4-4H8m0 0l3 3m-3-3l3-3m9 14V5a2 2 0 00-2-2H6a2 2 0 00-2 2v16l4-2 4 2 4-2 4 2z" />
                          </svg>
                          Return: {formatDate(ride.returnDate)}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center mt-2 text-sm">
                      <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-full text-xs mr-2">
                        {ride.availableSeats} {ride.availableSeats === 1 ? 'seat' : 'seats'}
                      </div>
                      <div className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 px-2 py-1 rounded-full text-xs">
                        ${ride.pricePerSeat}/seat
                      </div>
                    </div>
                  </div>

                  {!limit && (
                    <div className="flex space-x-1 ml-2">
                      <Link
                        href={`/community/ride-share/edit/${ride.id}`}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded"
                        title="Edit"
                      >
                        <PencilIcon className="w-4 h-4" />
                      </Link>

                      <button
                        onClick={() => handleDelete(ride.id)}
                        disabled={isDeleting && deleteId === ride.id}
                        className={`p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded ${
                          isDeleting && deleteId === ride.id ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                        title="Delete"
                      >
                        {isDeleting && deleteId === ride.id ? (
                          <div className="w-4 h-4 border-t-2 border-red-600 rounded-full animate-spin"></div>
                        ) : (
                          <TrashIcon className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default UserRides;
