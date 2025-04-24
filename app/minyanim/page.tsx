import React from 'react';
import { minyanim } from '@/data/minyanim';
import MinyanCard from '@/components/minyanim/MinyanCard';
import { MapPinIcon, ClockIcon, BookOpenIcon } from '@heroicons/react/24/outline';

export const metadata = {
  title: 'Minyanim | Kingston Anash',
  description: 'Find prayer times and information for local minyanim in the Kingston Anash community.',
};

export default function MinyanListPage() {
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="relative rounded-2xl overflow-hidden mb-16 bg-gradient-to-r from-primary to-secondary shadow-xl">
          <div className="absolute inset-0 bg-pattern opacity-10"></div>
          <div className="relative z-10 px-8 py-20 text-white">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Minyanim</h1>
            <p className="text-xl md:text-2xl max-w-3xl opacity-90 mb-8">
              Find prayer times and information for local minyanim in our community
            </p>

            <div className="flex flex-wrap gap-6 mt-8">
              <div className="flex items-center bg-white/20 backdrop-blur-sm px-5 py-3 rounded-xl">
                <ClockIcon className="h-6 w-6 mr-3 text-white/80" />
                <div>
                  <h3 className="font-medium">Daily Prayer Times</h3>
                  <p className="text-sm text-white/80">Shachris, Mincha & Maariv</p>
                </div>
              </div>

              <div className="flex items-center bg-white/20 backdrop-blur-sm px-5 py-3 rounded-xl">
                <BookOpenIcon className="h-6 w-6 mr-3 text-white/80" />
                <div>
                  <h3 className="font-medium">Learning Opportunities</h3>
                  <p className="text-sm text-white/80">Chassidus & Daily Shiurim</p>
                </div>
              </div>

              <div className="flex items-center bg-white/20 backdrop-blur-sm px-5 py-3 rounded-xl">
                <MapPinIcon className="h-6 w-6 mr-3 text-white/80" />
                <div>
                  <h3 className="font-medium">Multiple Locations</h3>
                  <p className="text-sm text-white/80">Find a minyan near you</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section Title */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            Available Minyanim
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Showing {minyanim.length} {minyanim.length === 1 ? 'location' : 'locations'}
          </p>
        </div>

        {/* Minyan Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {minyanim.map((minyan) => (
            <MinyanCard key={minyan.id} minyan={minyan} />
          ))}
        </div>

        {/* Additional Information */}
        <div className="mt-16 bg-white dark:bg-gray-800 rounded-xl p-8 shadow-md border border-gray-100 dark:border-gray-700">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">About Our Minyanim</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Our community offers multiple minyanim to accommodate different schedules and preferences.
            Each location provides daily prayer services and many offer learning opportunities throughout the week.
          </p>
          <p className="text-gray-600 dark:text-gray-400">
            Times may vary for holidays and special occasions. Please check with the specific location for the most up-to-date information.
          </p>
        </div>
      </div>
    </div>
  );
}
