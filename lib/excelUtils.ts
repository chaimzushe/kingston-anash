import * as XLSX from 'xlsx';
import path from 'path';
import fs from 'fs';

// Define the interface based on the actual Excel file structure
export interface CommunityMember {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  address?: string;
  occupation?: string;
  birthday?: string;
  anniversary?: string;
  spouse?: string;
  children?: string;
  imageUrl?: string;
  bio?: string;
  joinedDate?: string;
  role?: string;
  committees?: string;
}

export async function getCommunityMembers(): Promise<any[]> {
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

    console.log(`Loaded ${data.length} community members from Excel file`);
    debugger
    // Return the data as is, without any transformations
    return data as any[];
  } catch (error) {
    console.error('Error reading community members:', error);
    return [];
  }
}
