import React from 'react';
import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';
import { PageHeader } from '../../../components/layout';

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

export default function AnashCsvPage() {
  // Get the data from anash.csv
  const data = getAnashCsvData();
  
  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 font-[family-name:var(--font-geist-sans)] pattern-overlay">
      <div className="max-w-7xl mx-auto">
        <PageHeader
          title="Anash.csv Data"
          subtitle="Raw data from the anash.csv file"
        />
        
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Data Overview</h2>
          <div className="mb-4">
            <p className="text-gray-700 dark:text-gray-300">
              Total records: <span className="font-medium">{data.length}</span>
            </p>
            {data.length > 0 && (
              <p className="text-gray-700 dark:text-gray-300 mt-2">
                Fields available: <span className="font-medium">{Object.keys(data[0]).join(', ')}</span>
              </p>
            )}
          </div>
          
          <h2 className="text-xl font-semibold mb-4 mt-8">Raw Data</h2>
          <div className="overflow-x-auto">
            <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded-md text-sm overflow-auto max-h-[600px]">
              {JSON.stringify(data, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
