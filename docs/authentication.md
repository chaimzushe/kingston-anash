# Authentication System for Kingston Anash

This document explains how the authentication system works for the Kingston Anash website, particularly for protecting the Community Directory.

## Overview

The authentication system is designed to:

1. Allow only verified community members to access the Community Directory
2. Provide a registration and verification process
3. Integrate with the existing navigation and UI

## User Roles

The system supports the following user roles:

- **Guest**: Unauthenticated users who can view public content
- **Member (Unverified)**: Registered users who are waiting for verification
- **Member (Verified)**: Verified users who can access the Community Directory
- **Admin**: Users who can verify other users and manage content

## Authentication Flow

### Registration Process

1. User visits `/auth/request-access` and submits their information
2. Request is stored in Sanity as an `accessRequest` document
3. Admin reviews the request in Sanity Studio
4. If approved, admin creates a user account with `isVerified: true`
5. User is notified with their login credentials

### Admin User Creation Process

1. Admin logs into Sanity Studio
2. Admin reviews access requests in the "Access Requests" section
3. Admin approves or rejects the request
4. If approved, a new user account is created automatically
5. Admin can also create users directly in the "Users" section

### Sign In Process

1. User visits `/auth/signin` and enters credentials
2. If credentials are valid, user is authenticated
3. If user is verified, they can access the Community Directory
4. If user is not verified, they see an "Access Denied" message

## Protected Routes

The following routes are protected:

- `/community`: Requires authentication and verification

## Implementation Details

### Data Models

#### User

```javascript
{
  _type: 'user',
  name: 'User Name',
  email: 'user@example.com',
  password: 'hashed_password',
  isVerified: true/false,
  role: 'member' or 'admin',
  // Additional profile information
}
```

#### Access Request

```javascript
{
  _type: 'accessRequest',
  name: 'User Name',
  email: 'user@example.com',
  phone: '123-456-7890',
  message: 'Request message',
  status: 'pending' or 'approved' or 'rejected',
  // Additional metadata
}
```

### Authentication Components

- `AuthProvider`: Context provider for authentication state
- `AuthNav`: Navigation component for authentication links
- `MobileAuthLinks`: Mobile version of authentication links

### API Routes

- `/api/auth/[...nextauth]`: NextAuth.js API route for authentication
- `/api/auth/request-access`: API route for access requests
- `/api/auth/create-user`: Admin-only API route for creating users
- `/api/auth/approve-request`: Admin-only API route for approving access requests

## Admin Guide

### Verifying Users

1. Log in to Sanity Studio
2. Go to the "Users" section
3. Find the user you want to verify
4. Set `isVerified` to `true`
5. Save the changes

### Managing Access Requests

1. Log in to Sanity Studio
2. Go to the "Access Requests" section
3. Review pending requests
4. Approve or reject requests as needed
5. If approved, create a user account for the requester

## Security Considerations

- Passwords are hashed using bcrypt
- JWT tokens are used for session management
- Protected routes check authentication server-side
- Verification status is checked on both client and server

## Future Enhancements

- Email verification for new accounts
- Password reset functionality
- Two-factor authentication
- More granular permission system
