'use client';

import { useEffect, Suspense } from 'react';
import { initLogRocket } from '../../lib/logrocket';
import LogRocketRouteTracker from './LogRocketRouteTracker';

export default function LogRocketProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Initialize LogRocket as early as possible when the component mounts
    initLogRocket();
  }, []);

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
