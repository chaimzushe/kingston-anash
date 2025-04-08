"use client";

import { UserProfile } from "@clerk/nextjs";
import { PageHeader } from "@/components/layout";

export default function ProfilePage() {
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <PageHeader
          title="Your Profile"
          subtitle="Manage your account settings"
        />
        
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mt-8">
          <UserProfile appearance={{
            elements: {
              card: "bg-transparent shadow-none",
              navbar: "hidden",
              navbarMobileMenuButton: "hidden",
            }
          }} />
        </div>
      </div>
    </div>
  );
}
