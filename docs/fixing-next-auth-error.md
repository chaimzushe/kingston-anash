# Fixing the "Module not found: Can't resolve 'next-auth/react'" Error

This document explains how to fix the "Module not found: Can't resolve 'next-auth/react'" error that occurs during deployment.

## Understanding the Issue

The error occurs because:

1. The `next-auth` package is listed in your package.json dependencies
2. But the package might not be properly installed in your node_modules directory
3. Or there might be a version mismatch between what's installed and what's required

## Solution 1: Install Dependencies

The first step is to make sure all dependencies are properly installed:

```bash
npm install
```

If you encounter permission issues, you can try:

```bash
npm install --legacy-peer-deps
```

Or with sudo (if you're on Linux/Mac):

```bash
sudo npm install
```

## Solution 2: Clean Install

If a regular install doesn't work, try a clean install:

```bash
rm -rf node_modules
rm package-lock.json
npm install
```

## Solution 3: Install next-auth Explicitly

You can try installing next-auth explicitly:

```bash
npm install next-auth@4.24.11
```

## Solution 4: Check for Peer Dependencies

next-auth might have peer dependencies that need to be installed:

```bash
npm install next-auth@4.24.11 @auth/core
```

## Solution 5: Temporary Workaround

If you need to deploy quickly and can't resolve the dependency issue, you can use the temporary workaround we've implemented:

1. We've modified the code to work without next-auth for now
2. Authentication is simulated using cookies
3. Protected routes are temporarily accessible without authentication

**Note**: This is only a temporary solution. For production, you should properly install next-auth and restore the authentication functionality.

## Restoring Authentication After Fixing Dependencies

Once you've fixed the dependency issues:

1. Revert the changes we made to bypass authentication
2. Restore the next-auth configuration
3. Re-enable the authentication checks in protected routes

## Deployment Considerations

When deploying:

1. Make sure your deployment platform installs all dependencies
2. Check if your deployment platform has a "clean install" option
3. Consider adding a pre-build step to install dependencies explicitly

## Checking Installation Status

You can check if next-auth is properly installed by running:

```bash
npm list next-auth
```

This will show the installed version of next-auth and its location in your node_modules directory.
