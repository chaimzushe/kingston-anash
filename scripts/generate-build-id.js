// This script generates a build ID for cache busting
const fs = require('fs');
const path = require('path');

// Generate a timestamp-based build ID
const buildTime = Date.now().toString();

// Create or update the .env.local file with the build time
const envPath = path.join(process.cwd(), '.env.local');
let envContent = '';

// Read existing .env.local if it exists
if (fs.existsSync(envPath)) {
  envContent = fs.readFileSync(envPath, 'utf8');
}

// Check if NEXT_PUBLIC_BUILD_TIME already exists
if (envContent.includes('NEXT_PUBLIC_BUILD_TIME=')) {
  // Replace the existing value
  envContent = envContent.replace(
    /NEXT_PUBLIC_BUILD_TIME=.*/,
    `NEXT_PUBLIC_BUILD_TIME=${buildTime}`
  );
} else {
  // Add the new variable
  envContent += `\nNEXT_PUBLIC_BUILD_TIME=${buildTime}\n`;
}

// Write the updated content back to .env.local
fs.writeFileSync(envPath, envContent);

console.log(`Build ID generated: ${buildTime}`);
