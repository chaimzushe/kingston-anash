"use client";

import { SignIn } from "@clerk/nextjs";
import "./signin.css";
import { PageHeader } from "@/components/layout";
import Link from "next/link";

export default function SignInPage() {
  return (
    <div className="min-h-screen py-8 sm:py-12 px-1 sm:px-6 lg:px-8 pattern-overlay">
      <div className="w-full sm:max-w-xl lg:max-w-2xl mx-auto">
        <PageHeader
          title="Sign In"
          subtitle="Welcome back to Kingston Anash"
        />

        <div className="bg-white dark:bg-gray-800 rounded-lg p-2 sm:p-6 mt-4 sm:mt-8">
          <SignIn appearance={{
            elements: {
              formButtonPrimary:
                "bg-gradient-primary text-white font-medium rounded-md transition-all duration-200 hover:opacity-90",
              card: "bg-transparent shadow-none",
              rootBox: "w-full",
              formFieldInput: "w-full px-2 sm:px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white",
              formButtonReset: "text-primary hover:text-primary-dark",
              card__innerHeader: "border-none hidden",
              card__innerFooter: "border-none",
              form: "shadow-none",
              formField__label: "font-medium",
              identityPreview: "shadow-none border border-gray-200 dark:border-gray-700",
              alert: "shadow-none border border-gray-200 dark:border-gray-700",
              headerTitle: "hidden",
              headerSubtitle: "hidden",
            }
          }} />

          {/* Request Access Section */}
          <div className="mt-6 sm:mt-8 pt-5 border-t border-gray-200 dark:border-gray-700">
            <div className="text-center">
              <h3 className="text-base font-medium text-gray-900 dark:text-white mb-2">
                Are you a community member?
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Request access to join our community and use all features
              </p>
              <Link
                href="/auth/request-access"
                className="block w-full py-2.5 sm:py-3 px-4 bg-primary text-white text-center font-medium rounded-md hover:bg-primary/90 transition-all duration-200 cursor-pointer border-0"
              >
                REQUEST ACCESS
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
