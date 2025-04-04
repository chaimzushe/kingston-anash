import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';

/**
 * API endpoint that returns the anash.csv data as JSON
 * Access at /api/anash-csv
 */
export async function GET() {
  try {
    // Path to the CSV file
    const filePath = path.join(process.cwd(), 'data', 'anash.csv');
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return NextResponse.json(
        {
          success: false,
          error: 'CSV file not found'
        },
        { status: 404 }
      );
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
    
    return NextResponse.json({
      success: true,
      count: records.length,
      data: records
    });
  } catch (error) {
    console.error('Error in anash-csv API:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch anash data',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
