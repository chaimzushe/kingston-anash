"use client";

import React, { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { redirect, useParams } from 'next/navigation';
import Link from 'next/link';
import RideOfferForm from '@/components/rideShare/RideOfferForm';
import { RideShare } from '@/types/rideShare';

export default function EditRideOfferPage() {
  const { isLoaded, isSignedIn, user } = useUser();
  const params = useParams();
  const id = params.id as string;
  
  const [ride, setRide] = useState<RideShare | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Fetch the ride data
  useEffect(() => {
    if (isSignedIn && id) {
      fetchRide();
    }
  }, [isSignedIn, id]);
  
  const fetchRide = async () => {
    try {
      const response = await fetch(`/api/community/rides/${id}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch ride data');
      }
      
      const data = await response.json();
      setRide(data);
    } catch (error) {
      console.error('Error fetching ride:', error);
      setError('Failed to load ride data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Redirect if not signed in
  if (isLoaded && !isSignedIn) {
    redirect(`/sign-in?redirect=/community/ride-share/edit/${id}`);
  }
  
  // Check if the user is the owner of the ride
  if (ride && user && ride.userId !== user.id) {
    return (
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center">
            <div className="inline-block p-4 bg-red-100 dark:bg-red-900/20 rounded-full mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Unauthorized</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              You don't have permission to edit this ride offer.
            </p>
            <Link 
              href="/community/ride-share"
              className="px-6 py-3 bg-primary text-white rounded-lg font-medium shadow-sm hover:bg-primary-dark transition-colors"
            >
              Back to Ride Share
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/community/ride-share" 
            className="text-primary hover:text-primary-dark flex items-center mb-4"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Ride Share
          </Link>
          
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Edit Ride Offer</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Update your ride offer details below.
          </p>
        </div>
        
        {/* Loading State */}
        {isLoading && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 flex justify-center">
            <div className="flex items-center space-x-4">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
              <span className="text-gray-600 dark:text-gray-400">Loading ride data...</span>
            </div>
          </div>
        )}
        
        {/* Error State */}
        {error && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center">
            <div className="inline-block p-4 bg-red-100 dark:bg-red-900/20 rounded-full mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Error</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {error}
            </p>
            <button 
              onClick={fetchRide}
              className="px-6 py-3 bg-primary text-white rounded-lg font-medium shadow-sm hover:bg-primary-dark transition-colors"
            >
              Try Again
            </button>
          </div>
        )}
        
        {/* Form */}
        {!isLoading && !error && ride && (
          <RideOfferForm initialData={ride} isEditing={true} />
        )}
      </div>
    </div>
  );
}
