"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function SSOCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  useEffect(() => {
    // Get the redirect URL from the query parameters
    const redirectUrl = searchParams.get('redirect_url');
    
    // If there's a redirect URL, redirect to it
    if (redirectUrl) {
      window.location.href = redirectUrl;
    } else {
      // Otherwise, redirect to the sign-in page
      window.location.href = '/auth/signin';
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-gray-300 dark:border-gray-600 border-t-primary mx-auto"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-400">Redirecting...</p>
      </div>
    </div>
  );
}
