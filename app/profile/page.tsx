"use client";

import { useState } from "react";
import { useUser, useClerk } from "@clerk/nextjs";
import Link from "next/link";
import {
  CalendarIcon,
  UserIcon,
  CogIcon,
  ArrowRightIcon,
  MapIcon,
  ShieldCheckIcon,
  UserGroupIcon,
  PencilIcon,
  GiftIcon
} from "@heroicons/react/24/outline";
import UserEvents from "@/components/profile/UserEvents";
import UserRides from "@/components/profile/UserRides";

export default function ProfilePage() {
  const { user, isLoaded, isSignedIn } = useUser();
  const { signOut } = useClerk();

  // We'll use a client-side only approach for the profile page
  // to avoid hydration mismatches

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

  // State for active tab
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Banner with User Info */}
      <div className="bg-gradient-to-r from-primary to-secondary relative overflow-hidden">
        <div className="absolute inset-0 bg-pattern opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 relative z-10">
          <div className="flex flex-col md:flex-row items-center md:items-end gap-6 md:gap-10">
            {/* Profile Image */}
            <div className="relative">
              <div className="p-1 rounded-full bg-white dark:bg-gray-800 shadow-xl">
                {user?.imageUrl ? (
                  <img
                    src={user.imageUrl}
                    alt={user.fullName || "Profile"}
                    className="h-28 w-28 md:h-36 md:w-36 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-28 w-28 md:h-36 md:w-36 rounded-full bg-primary/20 flex items-center justify-center text-primary text-4xl font-bold">
                    {user?.firstName?.charAt(0) || user?.username?.charAt(0) || "U"}
                  </div>
                )}
              </div>
              <button className="absolute bottom-1 right-1 bg-white dark:bg-gray-800 p-2 rounded-full shadow-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <PencilIcon className="h-4 w-4 text-gray-600 dark:text-gray-300" />
              </button>
            </div>

            {/* User Info */}
            <div className="text-center md:text-left text-white flex-1">
              <h1 className="text-3xl md:text-4xl font-bold">
                {user?.fullName || user?.username || "Community Member"}
              </h1>
              <p className="mt-2 text-white/80 flex items-center justify-center md:justify-start">
                <UserIcon className="h-5 w-5 mr-2" />
                {user?.primaryEmailAddress?.emailAddress}
              </p>

              {/* Status Badge */}
              <div className="mt-4 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                <ShieldCheckIcon className="h-4 w-4 mr-1" />
                Verified Member
              </div>
            </div>

            {/* Action Buttons - Desktop */}
            <div className="hidden md:flex space-x-3">
              <button
                onClick={handleSignOut}
                className="inline-flex items-center px-4 py-2 border border-white text-sm font-medium rounded-md text-white hover:bg-white/10 transition-colors"
              >
                <ArrowRightIcon className="h-5 w-5 mr-2" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="md:w-64 flex-shrink-0">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden sticky top-8">
              <nav className="p-4">
                <ul className="space-y-1">
                  <li>
                    <button
                      onClick={() => setActiveTab('overview')}
                      className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${activeTab === 'overview' ? 'bg-primary text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200'}`}
                    >
                      <UserIcon className="h-5 w-5 mr-3" />
                      <span className="font-medium">Overview</span>
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => setActiveTab('events')}
                      className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${activeTab === 'events' ? 'bg-primary text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200'}`}
                    >
                      <CalendarIcon className="h-5 w-5 mr-3" />
                      <span className="font-medium">My Events</span>
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => setActiveTab('rides')}
                      className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${activeTab === 'rides' ? 'bg-primary text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200'}`}
                    >
                      <MapIcon className="h-5 w-5 mr-3" />
                      <span className="font-medium">My Rides</span>
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => setActiveTab('giveaways')}
                      className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${activeTab === 'giveaways' ? 'bg-primary text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200'}`}
                    >
                      <GiftIcon className="h-5 w-5 mr-3" />
                      <span className="font-medium">My Giveaways</span>
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => setActiveTab('community')}
                      className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${activeTab === 'community' ? 'bg-primary text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200'}`}
                    >
                      <UserGroupIcon className="h-5 w-5 mr-3" />
                      <span className="font-medium">Community</span>
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => setActiveTab('settings')}
                      className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${activeTab === 'settings' ? 'bg-primary text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200'}`}
                    >
                      <CogIcon className="h-5 w-5 mr-3" />
                      <span className="font-medium">Settings</span>
                    </button>
                  </li>
                </ul>
              </nav>

              {/* Mobile Sign Out Button */}
              <div className="p-4 border-t border-gray-200 dark:border-gray-700 md:hidden">
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <ArrowRightIcon className="h-5 w-5 mr-2" />
                  Sign Out
                </button>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-8">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                    <UserIcon className="h-5 w-5 mr-2 text-primary" />
                    Account Overview
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Full Name</h3>
                      <p className="mt-1 text-lg font-medium text-gray-900 dark:text-white">
                        {user?.fullName || 'Not provided'}
                      </p>
                    </div>
                    <div className="p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Email Address</h3>
                      <p className="mt-1 text-lg font-medium text-gray-900 dark:text-white">
                        {user?.primaryEmailAddress?.emailAddress || 'Not provided'}
                      </p>
                    </div>
                    <div className="p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Username</h3>
                      <p className="mt-1 text-lg font-medium text-gray-900 dark:text-white">
                        {user?.username || 'Not provided'}
                      </p>
                    </div>
                    <div className="p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Member Since</h3>
                      <p className="mt-1 text-lg font-medium text-gray-900 dark:text-white">
                        {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Recent Events Card */}
                  <div className="bg-gradient-to-br from-white to-blue-50 dark:from-gray-800 dark:to-gray-700 rounded-xl shadow-lg overflow-hidden border border-blue-100 dark:border-blue-900/30 transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                    <div className="p-1">
                      <div className="bg-gradient-to-r from-primary/90 to-secondary/90 text-white p-4 flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="bg-white/20 p-2 rounded-lg mr-3">
                            <CalendarIcon className="h-6 w-6" />
                          </div>
                          <h2 className="text-xl font-bold">Recent Events</h2>
                        </div>
                        <div className="bg-white/20 text-xs px-2 py-1 rounded-full">
                          {new Date().toLocaleDateString('en-US', {month: 'short', year: 'numeric'})}
                        </div>
                      </div>

                      <div className="p-5">
                        <UserEvents userId={user?.id} limit={2} />

                        <div className="mt-6 text-center">
                          <button
                            onClick={() => setActiveTab('events')}
                            className="inline-flex items-center px-4 py-2 bg-gradient-primary text-white rounded-full font-medium shadow-sm hover:shadow-md transition-all duration-200 transform hover:-translate-y-0.5"
                          >
                            <CalendarIcon className="h-4 w-4 mr-2" />
                            View All Events
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Recent Rides Card */}
                  <div className="bg-gradient-to-br from-white to-purple-50 dark:from-gray-800 dark:to-gray-700 rounded-xl shadow-lg overflow-hidden border border-purple-100 dark:border-purple-900/30 transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                    <div className="p-1">
                      <div className="bg-gradient-to-r from-secondary/90 to-primary/90 text-white p-4 flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="bg-white/20 p-2 rounded-lg mr-3">
                            <MapIcon className="h-6 w-6" />
                          </div>
                          <h2 className="text-xl font-bold">Recent Rides</h2>
                        </div>
                        <div className="bg-white/20 text-xs px-2 py-1 rounded-full">
                          {new Date().toLocaleDateString('en-US', {month: 'short', year: 'numeric'})}
                        </div>
                      </div>

                      <div className="p-5">
                        <UserRides limit={2} />

                        <div className="mt-6 text-center">
                          <button
                            onClick={() => setActiveTab('rides')}
                            className="inline-flex items-center px-4 py-2 bg-gradient-primary text-white rounded-full font-medium shadow-sm hover:shadow-md transition-all duration-200 transform hover:-translate-y-0.5"
                          >
                            <MapIcon className="h-4 w-4 mr-2" />
                            View All Rides
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Recent Giveaways Card */}
                  <div className="bg-gradient-to-br from-white to-green-50 dark:from-gray-800 dark:to-gray-700 rounded-xl shadow-lg overflow-hidden border border-green-100 dark:border-green-900/30 transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                    <div className="p-1">
                      <div className="bg-gradient-to-r from-green-500/90 to-primary/90 text-white p-4 flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="bg-white/20 p-2 rounded-lg mr-3">
                            <GiftIcon className="h-6 w-6" />
                          </div>
                          <h2 className="text-xl font-bold">Recent Giveaways</h2>
                        </div>
                        <div className="bg-white/20 text-xs px-2 py-1 rounded-full">
                          {new Date().toLocaleDateString('en-US', {month: 'short', year: 'numeric'})}
                        </div>
                      </div>

                      <div className="p-5">
                        {/* Placeholder for giveaway items */}
                        <div className="p-6 text-center bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
                          <div className="inline-block p-3 bg-gray-100 dark:bg-gray-700 rounded-full mb-3">
                            <GiftIcon className="h-6 w-6 text-gray-400" />
                          </div>
                          <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">No giveaway items yet</p>
                        </div>

                        <div className="mt-6 text-center">
                          <button
                            onClick={() => setActiveTab('giveaways')}
                            className="inline-flex items-center px-4 py-2 bg-gradient-primary text-white rounded-full font-medium shadow-sm hover:shadow-md transition-all duration-200 transform hover:-translate-y-0.5"
                          >
                            <GiftIcon className="h-4 w-4 mr-2" />
                            View All Giveaways
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Events Tab */}
            {activeTab === 'events' && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                    <CalendarIcon className="h-5 w-5 mr-2 text-primary" />
                    My Events
                  </h2>
                </div>
                <UserEvents userId={user?.id} />
              </div>
            )}

            {/* Rides Tab */}
            {activeTab === 'rides' && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                    <MapIcon className="h-5 w-5 mr-2 text-primary" />
                    My Rides
                  </h2>
                </div>
                <UserRides />
              </div>
            )}

            {/* Giveaways Tab */}
            {activeTab === 'giveaways' && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                    <GiftIcon className="h-5 w-5 mr-2 text-primary" />
                    My Giveaways
                  </h2>
                  <Link
                    href="/community/giveaways/new"
                    className="inline-flex items-center px-4 py-2 bg-gradient-primary text-white rounded-full font-medium shadow-sm hover:shadow-md transition-all duration-200"
                  >
                    <GiftIcon className="h-4 w-4 mr-2" />
                    Add Giveaway Item
                  </Link>
                </div>

                {/* Placeholder for giveaway items */}
                <div className="p-8 text-center bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="inline-block p-4 bg-gray-100 dark:bg-gray-700 rounded-full mb-4">
                    <GiftIcon className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No Giveaway Items</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">You haven't listed any items for giveaway yet.</p>
                  <Link
                    href="/community/giveaways/new"
                    className="px-4 py-2 bg-gradient-primary text-white rounded-full font-medium shadow-sm hover:shadow-md transition-all duration-200 inline-flex items-center"
                  >
                    <GiftIcon className="h-4 w-4 mr-2" />
                    Add Your First Item
                  </Link>
                </div>
              </div>
            )}

            {/* Community Tab */}
            {activeTab === 'community' && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                  <UserGroupIcon className="h-5 w-5 mr-2 text-primary" />
                  Community
                </h2>
                <div className="text-center py-8">
                  <div className="inline-block p-4 bg-gray-100 dark:bg-gray-700 rounded-full mb-4">
                    <UserGroupIcon className="h-12 w-12 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Community Features Coming Soon</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4 max-w-md mx-auto">
                    We're working on exciting new community features. Stay tuned for updates!
                  </p>
                </div>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                  <CogIcon className="h-5 w-5 mr-2 text-primary" />
                  Account Settings
                </h2>
                <div className="space-y-6">
                  <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Notification Preferences</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">Manage how you receive notifications</p>
                    <div className="space-y-3">
                      <label className="flex items-center">
                        <input type="checkbox" className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded" defaultChecked />
                        <span className="ml-2 text-gray-700 dark:text-gray-300">Email notifications</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded" defaultChecked />
                        <span className="ml-2 text-gray-700 dark:text-gray-300">Event reminders</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded" defaultChecked />
                        <span className="ml-2 text-gray-700 dark:text-gray-300">Community updates</span>
                      </label>
                    </div>
                  </div>

                  <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Privacy Settings</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">Control your privacy preferences</p>
                    <div className="space-y-3">
                      <label className="flex items-center">
                        <input type="checkbox" className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded" defaultChecked />
                        <span className="ml-2 text-gray-700 dark:text-gray-300">Show my profile in community directory</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded" defaultChecked />
                        <span className="ml-2 text-gray-700 dark:text-gray-300">Allow others to contact me</span>
                      </label>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors">
                      Save Settings
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
