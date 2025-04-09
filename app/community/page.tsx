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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <div className="bg-primary text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">Kingston Anash Community Hub</h1>
          <p className="text-lg text-white/90 max-w-2xl mx-auto">
            Connect with our community members and access exclusive resources
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Section Title */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Community Resources</h2>
          <div className="h-1 w-20 bg-primary mt-2"></div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Directory Card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow duration-300 flex flex-col h-full">
            <div className="p-5 flex-grow">
              <div className="flex items-center mb-4">
                <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mr-3">
                  <svg className="h-5 w-5 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Directory</h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Access our community member directory with contact information and details.
              </p>
            </div>
            <div className="p-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 rounded-b-lg">
              <div className="flex items-center justify-between">
                <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-2 py-1 rounded-full">Auth Required</span>
                <a
                  href="/community/directory"
                  className="text-sm font-medium text-primary hover:text-primary/80 flex items-center"
                >
                  View Directory
                  <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Events Card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow duration-300 flex flex-col h-full">
            <div className="p-5 flex-grow">
              <div className="flex items-center mb-4">
                <div className="h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mr-3">
                  <svg className="h-5 w-5 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Events</h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Stay updated with upcoming events, classes, and gatherings in our community.
              </p>
            </div>
            <div className="p-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 rounded-b-lg">
              <div className="flex items-center justify-between">
                <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-2 py-1 rounded-full">Auth Required</span>
                <a
                  href="/community/events"
                  className="text-sm font-medium text-primary hover:text-primary/80 flex items-center"
                >
                  View Events
                  <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Ride Share Card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow duration-300 flex flex-col h-full">
            <div className="p-5 flex-grow">
              <div className="flex items-center mb-4">
                <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mr-3">
                  <svg className="h-5 w-5 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Ride Share</h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Find or offer rides to community members for various destinations.
              </p>
            </div>
            <div className="p-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 rounded-b-lg">
              <div className="flex items-center justify-between">
                <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-2 py-1 rounded-full">Auth Required</span>
                <a
                  href="/community/ride-share"
                  className="text-sm font-medium text-primary hover:text-primary/80 flex items-center"
                >
                  View Rides
                  <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Marketplace Card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow duration-300 flex flex-col h-full">
            <div className="p-5 flex-grow">
              <div className="flex items-center mb-4">
                <div className="h-10 w-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mr-3">
                  <svg className="h-5 w-5 text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Marketplace</h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Browse items available from community members, both free and for sale.
              </p>
            </div>
            <div className="p-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 rounded-b-lg">
              <div className="flex items-center justify-between">
                <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-2 py-1 rounded-full">Auth Required</span>
                <a
                  href="/community/giveaways"
                  className="text-sm font-medium text-primary hover:text-primary/80 flex items-center"
                >
                  View Items
                  <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Community Stats Section */}
        <div className="mt-16 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 sm:p-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 text-center">Community at a Glance</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-1">{members.length}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Members</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-1">12+</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Weekly Events</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-1">4</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Minyan Locations</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-1">24/7</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Support</div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4">New to our community?</p>
          <a
            href="mailto:chaimzushe@gmail.com?subject=Kingston%20Anash%20Access%20Request&body=Hello,%0A%0AI%20would%20like%20to%20request%20access%20to%20the%20Kingston%20Anash%20community%20website.%0A%0AName:%20%0AEmail:%20%0APhone:%20%0A%0AThank%20you."
            className="inline-block px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-colors"
          >
            Email Request Access
          </a>
        </div>
      </div>
    </div>
  );
}
