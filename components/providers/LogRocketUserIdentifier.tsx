'use client';

import { useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { identifyUser } from '../../lib/logRocketUtils';
import { v4 as uuidv4 } from 'uuid';

/**
 * This component ensures all users are identified in LogRocket,
 * either with their actual user ID (if logged in) or with an anonymous ID.
 */
export default function LogRocketUserIdentifier() {
  const { user, isSignedIn } = useUser();

  useEffect(() => {
    // Function to get or create an anonymous ID
    const getAnonymousId = () => {
      // Try to get existing anonymous ID from localStorage
      let anonymousId = localStorage.getItem('anonymousId');

      // If no ID exists, create a new one and store it
      if (!anonymousId) {
        anonymousId = `anonymous-${uuidv4()}`;
        localStorage.setItem('anonymousId', anonymousId);
      }

      return anonymousId;
    };

    // If user is authenticated, identify them with their user info
    if (isSignedIn && user) {
      identifyUser(user.id, {
        name: user.firstName || user.username,
        email: user.primaryEmailAddress?.emailAddress,
        isAuthenticated: true
      });
    } else {
      // For anonymous users, use a persistent anonymous ID
      const anonymousId = getAnonymousId();
      identifyUser(anonymousId, {
        isAuthenticated: false,
        isAnonymous: true
      });
    }
  }, [user, isSignedIn]);

  // This component doesn't render anything
  return null;
}
