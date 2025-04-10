"use client";

import { useState, useEffect, useRef } from "react";
import { useUser, useClerk } from "@clerk/nextjs";
import { PageHeader } from "@/components/layout";

export default function ProfilePage() {
  const { user, isLoaded, isSignedIn } = useUser();
  const { signOut } = useClerk();
  const [status, setStatus] = useState("loading");
  const [statusMessage, setStatusMessage] = useState("Checking your account status...");

  // Use a ref to track if we've already checked the status
  const hasCheckedStatus = useRef(false);

  useEffect(() => {
    const checkUserStatus = async () => {
      // Only check status if user is signed in and we haven't checked yet
      if (isLoaded && isSignedIn && !hasCheckedStatus.current) {
        hasCheckedStatus.current = true;
        console.log('Checking user status from Clerk metadata...');

        try {
          // Get user role from Clerk metadata via our API
          const response = await fetch("/api/auth/check-role");

          if (response.ok) {
            const data = await response.json();
            setStatus(data.status || "unauthorized");
            setStatusMessage(data.message || "Unknown status");
          } else {
            // If API call fails, set unauthorized status
            setStatus("unauthorized");
            setStatusMessage("Unable to verify your account status. Please try again later.");
          }
        } catch (error) {
          console.error("Error checking user status:", error);
          setStatus("unauthorized");
          setStatusMessage("An error occurred while checking your account status.");
        }
      }
    };

    checkUserStatus();
  }, [isLoaded, isSignedIn]);

  const handleSignOut = async () => {
    try {
      await signOut();
      // Force a hard refresh to ensure all state is cleared
      window.location.href = "/";
    } catch (error) {
      console.error("Error signing out:", error);
      // If Clerk signOut fails, force a hard refresh anyway
      window.location.href = "/";
    }
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl font-bold">Please Sign In</h1>
          <p className="mt-4">You need to be signed in to view your profile.</p>
          <a
            href="/auth/signin"
            className="mt-6 inline-block px-6 py-3 bg-primary text-white rounded-md"
          >
            Sign In
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <PageHeader
          title="Your Profile"
          subtitle="Manage your account settings"
        />

   

        {/* User Info Card */}
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mb-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start">
            <div className="flex-shrink-0 mb-4 sm:mb-0">
              {user.imageUrl ? (
                <img
                  src={user.imageUrl}
                  alt={user.fullName || "Profile"}
                  className="h-24 w-24 rounded-full object-cover border-2 border-primary"
                />
              ) : (
                <div className="h-24 w-24 rounded-full bg-primary/20 flex items-center justify-center text-primary text-2xl font-bold">
                  {user.firstName?.charAt(0) || user.username?.charAt(0) || "U"}
                </div>
              )}
            </div>
            <div className="sm:ml-6 text-center sm:text-left">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {user.fullName || user.username || "Community Member"}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {user.primaryEmailAddress?.emailAddress}
              </p>
              <div className="mt-4 flex flex-wrap justify-center sm:justify-start gap-2">
                <button
                  onClick={handleSignOut}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
