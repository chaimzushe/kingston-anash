'use client';

import { useEffect, Suspense } from 'react';
import { useUser } from '@clerk/nextjs';
import { initLogRocket } from '../../lib/logrocket';
import { identifyClerkUser } from '../../lib/clerkUtils';
// Import the LogRocketRouteTracker component
import LogRocketRouteTracker from '../analytics/LogRocketRouteTracker';

export default function LogRocketProvider({ children }: { children: React.ReactNode }) {
  const { user, isLoaded } = useUser();

  useEffect(() => {
    // Initialize LogRocket as early as possible when the component mounts
    initLogRocket();
  }, []);

  // Identify user in LogRocket when user data is loaded
  useEffect(() => {
    if (isLoaded && user) {
      identifyClerkUser(user);
    }
  }, [isLoaded, user]);

  return (
    <>
      {/* Track route changes - wrapped in Suspense boundary */}
      <Suspense fallback={null}>
        <LogRocketRouteTracker />
      </Suspense>
      {children}
    </>
  );
}
