#!/usr/bin/env node

/**
 * This script reads the anash.csv file and displays the data as an array of objects
 * Run it with: node scripts/display-anash-csv.js
 */

const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync');

function getAnashCsvData() {
  try {
    // Path to the CSV file
    const filePath = path.join(__dirname, '..', 'data', 'anash.csv');
    
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
    
    return records;
  } catch (error) {
    console.error('Error reading anash.csv:', error);
    return [];
  }
}

// Get the data
const data = getAnashCsvData();

// Display the data
if (data.length === 0) {
  console.log('No data found in anash.csv');
  process.exit(1);
}

console.log('=== ANASH.CSV DATA ===');
console.log(`Total records: ${data.length}`);
console.log('Fields available:', Object.keys(data[0]).join(', '));
console.log('\nSample record:');
console.log(JSON.stringify(data[0], null, 2));
console.log('\nAll data:');
console.log(JSON.stringify(data, null, 2));
console.log('=== END OF DATA ===');
