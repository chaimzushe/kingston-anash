'use client';

import { useEffect } from 'react';
import { initLogRocket } from '../../lib/logrocket';

export default function LogRocketProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Initialize LogRocket when the component mounts
    initLogRocket();
  }, []);

  return <>{children}</>;
}
