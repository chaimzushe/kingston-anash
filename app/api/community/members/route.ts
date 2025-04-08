import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';

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

export async function GET(request: NextRequest) {
  try {
    // Get the members data
    const membersData = getAnashCsvData();

    // Return the data as JSON
    return NextResponse.json({ 
      members: membersData,
      count: membersData.length
    });
  } catch (error) {
    console.error('Error in members API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch members data' },
      { status: 500 }
    );
  }
}
