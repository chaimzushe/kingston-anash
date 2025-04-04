import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';

/**
 * Interface for Anash member data from CSV
 */
export interface AnashMember {
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

/**
 * Reads the anash.csv file and returns the data as an array of objects
 */
export function getAnashCsvData(): AnashMember[] {
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

/**
 * Displays the anash.csv data in a formatted way
 * This is useful for debugging in the console
 */
export function displayAnashCsvData(): void {
  const data = getAnashCsvData();
  
  if (data.length === 0) {
    console.log('No data found in anash.csv');
    return;
  }
  
  console.log('=== ANASH.CSV DATA ===');
  console.log(`Total records: ${data.length}`);
  console.log('Fields available:', Object.keys(data[0]).join(', '));
  console.log('Sample record:', data[0]);
  console.log('All data:', data);
  console.log('=== END OF DATA ===');
}

/**
 * Returns the anash.csv data as a formatted string
 * This is useful for displaying the data in a component
 */
export function getAnashCsvDataAsString(): string {
  const data = getAnashCsvData();
  
  if (data.length === 0) {
    return 'No data found in anash.csv';
  }
  
  return JSON.stringify(data, null, 2);
}
