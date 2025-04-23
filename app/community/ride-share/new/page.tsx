"use client";

import React from 'react';
import { useUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import RideOfferForm from '@/components/rideShare/RideOfferForm';

export default function NewRideOfferPage() {
  const { isLoaded, isSignedIn } = useUser();
  
  // Redirect if not signed in
  if (isLoaded && !isSignedIn) {
    redirect('/sign-in?redirect=/community/ride-share/new');
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
          
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Offer a Ride</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Fill out the form below to offer a ride to other community members.
          </p>
        </div>
        
        {/* Form */}
        <RideOfferForm />
      </div>
    </div>
  );
}
