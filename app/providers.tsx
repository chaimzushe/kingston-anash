"use client";

import { AuthProvider } from "@/contexts/AuthContext";
import LogRocketProvider from "../components/providers/LogRocketProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <LogRocketProvider>
        {children}
      </LogRocketProvider>
    </AuthProvider>
  );
}
