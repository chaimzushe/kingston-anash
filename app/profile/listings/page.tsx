"use client";

import React, { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { redirect, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { PageHeader } from '@/components/layout';
import { Giveaway } from '@/types/giveaways';

export default function UserListingsPage() {
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();
  const [listings, setListings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Redirect if not signed in
  if (isLoaded && !isSignedIn) {
    redirect('/sign-in?redirect=/profile/listings');
  }

  // Fetch user's listings
  useEffect(() => {
    const fetchListings = async () => {
      if (!user) return;
      
      try {
        const response = await fetch(`/api/community/giveaways?userId=${user.id}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch listings');
        }
        
        const data = await response.json();
        setListings(data);
      } catch (error) {
        console.error('Error fetching listings:', error);
        setError('Failed to load your listings. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    if (isSignedIn) {
      fetchListings();
    }
  }, [isSignedIn, user]);

  // Handle delete confirmation
  const confirmDelete = (id: string) => {
    setDeleteId(id);
  };

  // Cancel delete
  const cancelDelete = () => {
    setDeleteId(null);
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    try {
      setIsDeleting(true);
      
      const response = await fetch(`/api/community/giveaways/delete?id=${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete listing');
      }
      
      // Remove the deleted listing from state
      setListings(prev => prev.filter(listing => listing._id !== id));
      setDeleteId(null);
    } catch (error) {
      console.error('Error deleting listing:', error);
      setError('Failed to delete the listing. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 pattern-overlay">
        <div className="max-w-6xl mx-auto">
          <PageHeader
            title="My Listings"
            subtitle="Manage your marketplace listings"
          />
          <div className="mt-8 flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 pattern-overlay">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center">
          <PageHeader
            title="My Listings"
            subtitle="Manage your marketplace listings"
          />
          <Link
            href="/community/giveaways/new"
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors duration-200"
          >
            Post New Item
          </Link>
        </div>
        
        {error && (
          <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-md">
            {error}
          </div>
        )}
        
        <div className="mt-8">
          {listings.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg p-8 text-center shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <p className="text-gray-500 dark:text-gray-400 text-lg font-medium">You don't have any listings yet</p>
              <p className="mt-2 text-gray-500 dark:text-gray-400">Post your first item to get started</p>
              <Link
                href="/community/giveaways/new"
                className="mt-4 inline-block px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors duration-200"
              >
                Post New Item
              </Link>
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Item
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Posted
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Price
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {listings.map((listing) => (
                      <tr key={listing._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 flex-shrink-0">
                              {listing.images && listing.images.length > 0 ? (
                                <div className="h-10 w-10 rounded-md overflow-hidden relative">
                                  <Image
                                    src={listing.images[0].url}
                                    alt={listing.title}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                              ) : (
                                <div className="h-10 w-10 rounded-md bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                  </svg>
                                </div>
                              )}
                            </div>
                            <div className="ml-4">
                              <Link
                                href={`/community/giveaways/${listing._id}`}
                                className="text-sm font-medium text-gray-900 dark:text-white hover:text-primary"
                              >
                                {listing.title}
                              </Link>
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                {listing.category}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            listing.isAvailable
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                              : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                          }`}>
                            {listing.isAvailable ? 'Available' : 'Taken'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {formatDate(listing.postedDate)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {listing.isFree ? (
                            <span className="text-green-600 dark:text-green-400">Free</span>
                          ) : (
                            <span>${listing.price}</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          {deleteId === listing._id ? (
                            <div className="flex items-center justify-end space-x-2">
                              <span className="text-gray-500 dark:text-gray-400 text-xs">Confirm?</span>
                              <button
                                onClick={() => handleDelete(listing._id)}
                                disabled={isDeleting}
                                className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                              >
                                {isDeleting ? 'Deleting...' : 'Yes'}
                              </button>
                              <button
                                onClick={cancelDelete}
                                className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300"
                              >
                                No
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center justify-end space-x-4">
                              <Link
                                href={`/community/giveaways/edit/${listing._id}`}
                                className="text-primary hover:text-primary-dark"
                              >
                                Edit
                              </Link>
                              <button
                                onClick={() => confirmDelete(listing._id)}
                                className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                              >
                                Delete
                              </button>
                              <button
                                onClick={async () => {
                                  try {
                                    await fetch(`/api/community/giveaways/update`, {
                                      method: 'PUT',
                                      headers: {
                                        'Content-Type': 'application/json',
                                      },
                                      body: JSON.stringify({
                                        id: listing._id,
                                        isAvailable: !listing.isAvailable,
                                      }),
                                    });
                                    
                                    // Update the listing in state
                                    setListings(prev => 
                                      prev.map(item => 
                                        item._id === listing._id 
                                          ? { ...item, isAvailable: !item.isAvailable } 
                                          : item
                                      )
                                    );
                                  } catch (error) {
                                    console.error('Error updating listing status:', error);
                                  }
                                }}
                                className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300"
                              >
                                Mark as {listing.isAvailable ? 'Taken' : 'Available'}
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
