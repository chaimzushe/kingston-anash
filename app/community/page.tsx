import React from 'react';
import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../api/auth/[...nextauth]/route';
import { PageHeader } from '../../components/layout';
import CommunityDirectory from '../../components/community/CommunityDirectory';

// Define the interface for Anash member data
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

// Function to get the CSV data
function getAnashCsvData(): AnashMember[] {
  try {
    // Path to the CSV file
    const filePath = path.join(process.cwd(), 'data', 'anash.csv');

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      console.error(`CSV file not found at ${filePath}`);
      return [];
    }

    // Read the file
    const fileContent = fs.readFileSync(filePath, 'utf8');

    // Parse the CSV file
    const records = parse(fileContent, {
      columns: [
        'Lead', 'LastName', 'Man', 'Woman', 'Ask', 'Pledged', 'Gave',
        'Address', 'City', 'ST', 'Zip', 'ManPhone', 'WomanPhone',
        'ManEmail', 'WomanEmail', 'Home'
      ],
      skip_empty_lines: true,
      from_line: 2 // Skip the header row
    });

    console.log(`Loaded ${records.length} records from anash.csv`);

    return records as AnashMember[];
  } catch (error) {
    console.error('Error reading anash.csv:', error);
    return [];
  }
}

export default async function CommunityPage() {
  // Check if user is authenticated
  const session = await getServerSession(authOptions);

  // If not authenticated, redirect to sign in page
  if (!session) {
    redirect('/auth/signin?callbackUrl=/community');
  }

  // If authenticated but not verified, show access denied
  if (!session.user.isVerified) {
    return (
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 pattern-overlay">
        <div className="max-w-4xl mx-auto">
          <PageHeader
            title="Access Denied"
            subtitle="You need to be a verified community member to access this page"
          />

          <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 mt-8 rounded-r-lg">
            <p className="text-red-700 dark:text-red-300">
              Your account has not been verified yet. Please contact an administrator for verification.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Fetch community members from the CSV file
  const membersData = getAnashCsvData();

  // Serialize the data to plain objects
  const members = JSON.parse(JSON.stringify(membersData));

  return (
    <div className="min-h-screen py-8 px-2 sm:px-6 lg:px-8 font-[family-name:var(--font-geist-sans)] pattern-overlay">
      <div className="max-w-7xl mx-auto">
        {/* Page header - hidden on mobile when scrolled due to sticky search */}
        <div className="md:block">
          <PageHeader
            title="Kingston Anash Directory"
            subtitle="Search and browse our community members"
          />
        </div>

        <CommunityDirectory members={members} />
      </div>
    </div>
  );
}
