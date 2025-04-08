"use client";

import { ClerkProvider, useAuth } from "@clerk/nextjs";
import LogRocketProvider from "../components/providers/LogRocketProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}>
      <LogRocketProvider>
        {children}
      </LogRocketProvider>
    </ClerkProvider>
  );
}
