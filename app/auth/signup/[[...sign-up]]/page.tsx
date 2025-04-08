"use client";

import { SignUp } from "@clerk/nextjs";
import { PageHeader } from "@/components/layout";

export default function SignUpPage() {
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 pattern-overlay">
      <div className="max-w-md mx-auto">
        <PageHeader
          title="Create Account"
          subtitle="Join the Kingston Anash community"
        />
        
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mt-8">
          <SignUp appearance={{
            elements: {
              formButtonPrimary: 
                "bg-gradient-primary text-white font-medium rounded-md shadow-sm transition-all duration-200 hover:opacity-90 hover:shadow-md",
              card: "bg-transparent shadow-none",
            }
          }} />
        </div>
      </div>
    </div>
  );
}
