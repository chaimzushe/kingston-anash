"use client";

import React from 'react';
import { useUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import { PageHeader } from '@/components/layout';
import GiveawayForm from '@/components/giveaways/GiveawayForm';

export default function NewGiveawayPage() {
  const { isLoaded, isSignedIn, user } = useUser();

  // Redirect if not signed in
  if (isLoaded && !isSignedIn) {
    redirect('/sign-in?redirect=/community/giveaways/new');
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 pattern-overlay">
      <div className="max-w-4xl mx-auto">
        <PageHeader
          title="Post New Item"
          subtitle="Share items you no longer need with the community"
        />
        
        <div className="mt-8">
          <GiveawayForm />
        </div>
      </div>
    </div>
  );
}
