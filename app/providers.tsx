"use client";

import { ClerkProvider } from "@clerk/nextjs";
import LogRocketProvider from "../components/providers/LogRocketProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <LogRocketProvider>
        {children}
      </LogRocketProvider>
    </ClerkProvider>
  );
}
