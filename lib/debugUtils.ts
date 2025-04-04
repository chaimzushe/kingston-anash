import * as XLSX from 'xlsx';
import path from 'path';
import fs from 'fs';

/**
 * Reads the anash.xlsx file and returns the raw data as an array of objects
 * This is useful for debugging or for components that need access to the raw data
 */
export function getAnashData(): any[] {
  try {
    // Path to the Excel file
    const filePath = path.join(process.cwd(), 'data', 'anash.xlsx');
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      console.error(`Excel file not found at ${filePath}`);
      return [];
    }
    
    // Read the file
    const fileBuffer = fs.readFileSync(filePath);
    
    // Parse the Excel file
    const workbook = XLSX.read(fileBuffer);
    
    // Get the first sheet
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    
    // Convert to JSON - this will directly map the Excel columns to object properties
    const data = XLSX.utils.sheet_to_json(sheet);
    
    console.log(`Loaded ${data.length} records from anash.xlsx`);
    
    return data;
  } catch (error) {
    console.error('Error reading anash.xlsx:', error);
    return [];
  }
}

/**
 * Displays the anash.xlsx data in a formatted way
 * This is useful for debugging in the console
 */
export function displayAnashData(): void {
  const data = getAnashData();
  
  if (data.length === 0) {
    console.log('No data found in anash.xlsx');
    return;
  }
  
  console.log('=== ANASH.XLSX DATA ===');
  console.log(`Total records: ${data.length}`);
  console.log('Fields available:', Object.keys(data[0]).join(', '));
  console.log('Sample record:', data[0]);
  console.log('All data:', data);
  console.log('=== END OF DATA ===');
}

/**
 * Returns the anash.xlsx data as a formatted string
 * This is useful for displaying the data in a component
 */
export function getAnashDataAsString(): string {
  const data = getAnashData();
  
  if (data.length === 0) {
    return 'No data found in anash.xlsx';
  }
  
  return JSON.stringify(data, null, 2);
}
