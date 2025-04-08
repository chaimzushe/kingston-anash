"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PageHeader } from '@/components/layout';
import CommunityDirectory from '@/components/community/CommunityDirectory';
import { useUser } from '@clerk/nextjs';

// This is a client component that will fetch data from the server
export default function DirectoryPage() {
  const router = useRouter();
  const { isSignedIn, isLoaded } = useUser();
  // Import the AnashMember interface from the CommunityDirectory component
  interface AnashMember {
    Lead: string;
    LastName: string;
    Man: string;
    Woman: string;
    Ask: string;
    Pledged: string;
    Gave: string;
    Address: string;
    City: string;
    ST: string;
    Zip: string;
    ManPhone: string;
    WomanPhone: string;
    ManEmail: string;
    WomanEmail: string;
    Home: string;
    [key: string]: string; // Index signature for dynamic access
  }

  const [members, setMembers] = useState<AnashMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Client-side authentication check as a backup
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      console.log('User not signed in, redirecting to sign-in page');
      router.push('/auth/signin?redirect_url=/community/directory');
    }
  }, [isLoaded, isSignedIn, router]);

  // Fetch members data when component mounts
  React.useEffect(() => {
    async function fetchMembers() {
      try {
        setIsLoading(true);
        const response = await fetch('/api/community/members');

        if (!response.ok) {
          throw new Error('Failed to fetch members');
        }

        const data = await response.json();
        setMembers(data.members);
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching members:', err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        setIsLoading(false);

        // For demo purposes, set some dummy data if the API fails
        setMembers([
          {
            Lead: '',
            LastName: 'Cohen',
            Man: 'David',
            Woman: 'Sarah',
            Ask: '',
            Pledged: '',
            Gave: '',
            Address: '123 Main St',
            City: 'Kingston',
            ST: 'NY',
            Zip: '12401',
            ManPhone: '845-555-1234',
            WomanPhone: '845-555-5678',
            ManEmail: 'david@example.com',
            WomanEmail: 'sarah@example.com',
            Home: '845-555-9012'
          },
          {
            Lead: '',
            LastName: 'Levy',
            Man: 'Jacob',
            Woman: 'Rebecca',
            Ask: '',
            Pledged: '',
            Gave: '',
            Address: '456 Oak Ave',
            City: 'Kingston',
            ST: 'NY',
            Zip: '12401',
            ManPhone: '845-555-2345',
            WomanPhone: '845-555-6789',
            ManEmail: 'jacob@example.com',
            WomanEmail: 'rebecca@example.com',
            Home: '845-555-0123'
          },
          {
            Lead: '',
            LastName: 'Goldberg',
            Man: 'Isaac',
            Woman: 'Leah',
            Ask: '',
            Pledged: '',
            Gave: '',
            Address: '789 Pine St',
            City: 'Kingston',
            ST: 'NY',
            Zip: '12401',
            ManPhone: '845-555-3456',
            WomanPhone: '845-555-7890',
            ManEmail: 'isaac@example.com',
            WomanEmail: 'leah@example.com',
            Home: '845-555-1234'
          }
        ]);
      }
    }

    fetchMembers();
  }, []);

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
            href="/auth/signin?redirect_url=/community/directory"
            className="mt-4 inline-block px-6 py-3 bg-primary text-white rounded-md"
          >
            Sign In
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-2 sm:px-6 lg:px-8 font-[family-name:var(--font-geist-sans)] pattern-overlay">
      <div className="max-w-7xl mx-auto">
        {/* Page header */}
        <div className="md:block">
          <PageHeader
            title="Kingston Anash Directory"
            subtitle="Search and browse our community members"
          />
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative mt-6" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        ) : (
          <CommunityDirectory members={members} />
        )}
      </div>
    </div>
  );
}
