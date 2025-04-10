"use client";

import { useEffect, useState } from "react";
import { SignIn } from "@clerk/nextjs";
import { useUser } from "@clerk/nextjs";
import { PageHeader } from "@/components/layout";
import { clerkConfig } from "@/app/clerk";
import "./signin.css";

export default function SignInPage() {
  const { isLoaded, isSignedIn } = useUser();
  const [isRedirecting, setIsRedirecting] = useState(false);

  // Redirect authenticated users to the requested page
  useEffect(() => {
    if (isLoaded && isSignedIn) {
      setIsRedirecting(true);
      // Get the redirect URL from the query parameters
      const params = new URLSearchParams(window.location.search);
      const redirectUrl = params.get('redirect_url');

      // If there's a redirect URL, redirect to it
      if (redirectUrl) {
        window.location.href = redirectUrl;
      } else {
        // Otherwise, redirect to the community page
        window.location.href = '/community';
      }
    }
  }, [isLoaded, isSignedIn]);

  return (
    <div className="min-h-screen py-8 sm:py-12 px-4 sm:px-6 lg:px-8 pattern-overlay flex justify-center items-start">
      <div className="w-full sm:max-w-xl lg:max-w-3xl mx-auto">
        <PageHeader
          title="Sign In"
          subtitle="Welcome to Kingston Anash"
        />

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 sm:p-8 mt-4 sm:mt-8 shadow-md">
          {isRedirecting ? (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-400">Redirecting you...</p>
            </div>
          ) : (
            <>
              <div className="flex justify-center w-full">
                <SignIn
                  appearance={{
                    elements: {
                      formButtonPrimary:
                        "bg-gradient-primary text-white font-medium rounded-md transition-all duration-200 hover:opacity-90",
                      card: "bg-transparent shadow-none",
                      rootBox: "w-full max-w-md mx-auto",
                      formFieldInput: "w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white",
                      formButtonReset: "text-primary hover:text-primary-dark",
                      card__innerHeader: "border-none hidden",
                      card__innerFooter: "border-none",
                      form: "shadow-none w-full",
                      formField__label: "font-medium",
                      identityPreview: "shadow-none border border-gray-200 dark:border-gray-700",
                      alert: "shadow-none border border-gray-200 dark:border-gray-700",
                      headerTitle: "hidden",
                      headerSubtitle: "hidden",
                      footerAction: "hidden",
                      footerActionLink: "hidden",
                      footer: "hidden",
                    }
                  }}
                  path={clerkConfig.signInUrl}
                  routing="path"
                  signUpUrl={clerkConfig.signUpUrl}
                  afterSignInUrl={clerkConfig.afterSignInUrl}
                />
              </div>

              {/* Request Access Section */}
              <div className="mt-8 sm:mt-10 pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="text-center max-w-md mx-auto">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    Not a community member yet?
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Send an email to request access to our community
                  </p>
                  <a
                    href="mailto:chaimzushe@gmail.com?subject=Kingston%20Anash%20Access%20Request&body=Hello,%0A%0AI%20would%20like%20to%20request%20access%20to%20the%20Kingston%20Anash%20community%20website.%0A%0AName:%20%0AEmail:%20%0APhone:%20%0A%0AThank%20you."
                    className="block w-full py-3 px-4 bg-primary text-white text-center font-medium rounded-md hover:bg-primary/90 transition-all duration-200 cursor-pointer border-0 shadow-sm"
                  >
                    REQUEST ACCESS
                  </a>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
