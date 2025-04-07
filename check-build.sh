#!/bin/bash

# Generate a build ID
echo "Generating build ID..."
node scripts/generate-build-id.js

# Run the build
echo "Running build..."
next build

# Check the exit code
if [ $? -eq 0 ]; then
  echo "Build successful!"
else
  echo "Build failed!"
fi
