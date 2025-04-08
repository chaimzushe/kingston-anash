import React from 'react';
import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';
import { PageHeader } from '../../components/layout';

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

export default function CommunityPage() {
  // For now, we'll allow access to the community page without authentication
  // In a real app, you would implement proper authentication checks
  // This is a temporary solution to fix the currentUser import error

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
            title="Community Hub"
            subtitle="Connect with our community members and resources"
          />
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Directory Card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Community Directory</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Access our community member directory with contact information and details.
              </p>
              <div className="flex justify-between items-center">
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">Authentication Required</span>
                <a
                  href="/community/directory"
                  className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
                >
                  View Directory
                </a>
              </div>
            </div>
          </div>

          {/* Events Card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Community Events</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Stay updated with upcoming events, classes, and gatherings in our community.
              </p>
              <div className="flex justify-between items-center">
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">Authentication Required</span>
                <a
                  href="/community/events"
                  className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
                >
                  View Events
                </a>
              </div>
            </div>
          </div>

          {/* Ride Share Card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Ride Share</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Find or offer rides to community members for various destinations.
              </p>
              <div className="flex justify-between items-center">
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">Authentication Required</span>
                <a
                  href="/community/ride-share"
                  className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
                >
                  View Rides
                </a>
              </div>
            </div>
          </div>

          {/* Giveaways Card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Community Marketplace</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Browse items available from community members, both free and for sale.
              </p>
              <div className="flex justify-between items-center">
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">Authentication Required</span>
                <a
                  href="/community/giveaways"
                  className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
                >
                  View Items
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
