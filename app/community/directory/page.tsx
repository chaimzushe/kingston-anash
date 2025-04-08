"use client";

import React, { useState } from 'react';
import { PageHeader } from '@/components/layout';
import CommunityDirectory from '@/components/community/CommunityDirectory';

// This is a client component that will fetch data from the server
export default function DirectoryPage() {
  const [members, setMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

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
        setError(err.message);
        setIsLoading(false);
        
        // For demo purposes, set some dummy data if the API fails
        setMembers([
          {
            LastName: 'Cohen',
            Man: 'David',
            Woman: 'Sarah',
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
            LastName: 'Levy',
            Man: 'Jacob',
            Woman: 'Rebecca',
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
            LastName: 'Goldberg',
            Man: 'Isaac',
            Woman: 'Leah',
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
