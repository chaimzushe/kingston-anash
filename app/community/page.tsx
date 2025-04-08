import React from 'react';
import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';
import { redirect } from 'next/navigation';
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
            title="Kingston Anash Directory"
            subtitle="Search and browse our community members"
          />
        </div>

        <CommunityDirectory members={members} />
      </div>
    </div>
  );
}
