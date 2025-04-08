'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { logPageView } from '../../lib/logrocket';

/**
 * This component tracks route changes in Next.js and logs them to LogRocket
 * It should be included near the top of your app layout
 */
export default function LogRocketRouteTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Log page view when the route changes
    if (pathname) {
      const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '');
      logPageView(url);
    }
  }, [pathname, searchParams]);

  // This component doesn't render anything
  return null;
}
