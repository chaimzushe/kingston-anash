#!/usr/bin/env node

/**
 * This script reads the anash.xlsx file and displays the data as an array of objects
 * Run it with: node scripts/display-anash-data.js
 */

const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');

function getAnashData() {
  try {
    // Path to the Excel file
    const filePath = path.join(__dirname, '..', 'data', 'anash.xlsx');
    
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

// Get the data
const data = getAnashData();

// Display the data
if (data.length === 0) {
  console.log('No data found in anash.xlsx');
  process.exit(1);
}

console.log('=== ANASH.XLSX DATA ===');
console.log(`Total records: ${data.length}`);
console.log('Fields available:', Object.keys(data[0]).join(', '));
console.log('\nSample record:');
console.log(JSON.stringify(data[0], null, 2));
console.log('\nAll data:');
console.log(JSON.stringify(data, null, 2));
console.log('=== END OF DATA ===');
