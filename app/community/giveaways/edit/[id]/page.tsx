"use client";

import React, { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { redirect, useRouter, useParams } from 'next/navigation';
import { PageHeader } from '@/components/layout';
import GiveawayForm from '@/components/giveaways/GiveawayForm';
import { Giveaway } from '@/types/giveaways';

export default function EditGiveawayPage() {
  const params = useParams();
  const id = params.id as string;
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();
  const [giveaway, setGiveaway] = useState<Giveaway | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch the giveaway data
  useEffect(() => {
    const fetchGiveaway = async () => {
      try {
        const response = await fetch(`/api/community/giveaways/${id}`);

        if (!response.ok) {
          throw new Error('Failed to fetch giveaway');
        }

        const data = await response.json();
        setGiveaway(data);
      } catch (error) {
        console.error('Error fetching giveaway:', error);
        setError('Failed to load the item. It may have been deleted or you may not have permission to edit it.');
      } finally {
        setIsLoading(false);
      }
    };

    if (isSignedIn && id) {
      fetchGiveaway();
    }
  }, [isSignedIn, id]);

  // Redirect if not signed in
  if (isLoaded && !isSignedIn) {
    redirect(`/sign-in?redirect=/community/giveaways/edit/${id}`);
  }

  // Check if user has permission to edit
  useEffect(() => {
    if (!isLoading && giveaway && user) {
      if (giveaway.userId !== user.id) {
        router.push('/community/giveaways');
      }
    }
  }, [isLoading, giveaway, user, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 pattern-overlay">
        <div className="max-w-4xl mx-auto">
          <PageHeader
            title="Edit Item"
            subtitle="Update your listing"
          />
          <div className="mt-8 flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 pattern-overlay">
        <div className="max-w-4xl mx-auto">
          <PageHeader
            title="Edit Item"
            subtitle="Update your listing"
          />
          <div className="mt-8 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            <div className="text-red-600 dark:text-red-400">{error}</div>
            <button
              onClick={() => router.push('/community/giveaways')}
              className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
            >
              Back to Listings
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 pattern-overlay">
      <div className="max-w-4xl mx-auto">
        <PageHeader
          title="Edit Item"
          subtitle="Update your listing"
        />

        <div className="mt-8">
          {giveaway && (
            <GiveawayForm
              initialData={giveaway}
              isEditing={true}
              onSuccess={() => router.push('/community/giveaways')}
            />
          )}
        </div>
      </div>
    </div>
  );
}
