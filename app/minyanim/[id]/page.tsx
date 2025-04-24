import React from 'react';
import { notFound } from 'next/navigation';
import { minyanim } from '@/data/minyanim';
import MinyanHeader from '@/components/minyanim/MinyanHeader';
import PrayerTimeCard from '@/components/minyanim/PrayerTimeCard';
import ChassidusTimeCard from '@/components/minyanim/ChassidusTimeCard';
import ShiurimCard from '@/components/minyanim/ShiurimCard';
import ShabbosOnlyMinyan from '@/components/minyanim/ShabbosOnlyMinyan';

export async function generateStaticParams() {
  return minyanim.map((minyan) => ({
    id: minyan.id,
  }));
}

export async function generateMetadata({ params }: any) {
  const minyan = minyanim.find((minyan) => minyan.id === params.id);

  if (!minyan) {
    return {
      title: 'Minyan Not Found',
      description: 'The requested minyan could not be found.',
    };
  }

  return {
    title: `${minyan.name} | Kingston Anash`,
    description: `Prayer times and information for ${minyan.name}`,
  };
}

export default function MinyanDetailPage({ params }: any) {
  const minyan = minyanim.find((minyan) => minyan.id === params.id);

  if (!minyan) {
    notFound();
  }

  const isShabbosOnly = minyan.shabbosOnly === true;

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-6xl mx-auto">
        {/* Minyan Header with Image and Info */}
        <MinyanHeader minyan={minyan} />

        {/* Main Content */}
        {isShabbosOnly ? (
          <ShabbosOnlyMinyan minyan={minyan} />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            {/* Left Column - Prayer Times */}
            <div className="lg:col-span-2 space-y-8">
              {/* Prayer Times Section */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                  <span className="bg-primary/10 dark:bg-primary/20 p-2 rounded-full mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </span>
                  Daily Prayer Schedule
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Chassidus Times */}
                  {minyan.chassidus && (
                    <div className="md:col-span-2">
                      <ChassidusTimeCard times={minyan.chassidus} />
                    </div>
                  )}

                  {/* Shachris */}
                  <PrayerTimeCard
                    title="Shachris"
                    times={minyan.shachris}
                    colorClass="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-200"
                    iconClass="text-blue-500"
                  />

                  {/* Mincha */}
                  <PrayerTimeCard
                    title="Mincha"
                    times={minyan.mincha}
                    colorClass="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-200"
                    iconClass="text-green-500"
                  />

                  {/* Maariv */}
                  <PrayerTimeCard
                    title="Maariv"
                    times={minyan.maariv}
                    colorClass="bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-200"
                    iconClass="text-purple-500"
                  />
                </div>
              </div>

              {/* Shabbos Section */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                  <span className="bg-primary/10 dark:bg-primary/20 p-2 rounded-full mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </span>
                  Shabbos Schedule
                </h2>

                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow duration-300">
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-200 px-4 py-3 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    <h3 className="text-lg font-bold">Shabbos Services</h3>
                  </div>

                  <div className="p-4">
                    <div className="space-y-3">
                      {minyan.shabbos.kabbalatShabbat && (
                        <div className="flex">
                          <div className="w-1/2 font-medium text-gray-700 dark:text-gray-300">Kabbalat Shabbat:</div>
                          <div className="w-1/2 text-gray-600 dark:text-gray-400">{minyan.shabbos.kabbalatShabbat}</div>
                        </div>
                      )}

                      {minyan.shabbos.shachris && (
                        <div className="flex">
                          <div className="w-1/2 font-medium text-gray-700 dark:text-gray-300">Shachris:</div>
                          <div className="w-1/2 text-gray-600 dark:text-gray-400">{minyan.shabbos.shachris}</div>
                        </div>
                      )}

                      {minyan.shabbos.mincha && (
                        <div className="flex">
                          <div className="w-1/2 font-medium text-gray-700 dark:text-gray-300">Mincha:</div>
                          <div className="w-1/2 text-gray-600 dark:text-gray-400">{minyan.shabbos.mincha}</div>
                        </div>
                      )}

                      {minyan.shabbos.farbrengen && (
                        <div className="flex">
                          <div className="w-1/2 font-medium text-gray-700 dark:text-gray-300">Farbrengen:</div>
                          <div className="w-1/2 text-gray-600 dark:text-gray-400">{minyan.shabbos.farbrengen}</div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Shiurim */}
            <div className="space-y-8">
              {minyan.shiurim && minyan.shiurim.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                    <span className="bg-primary/10 dark:bg-primary/20 p-2 rounded-full mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </span>
                    Learning Opportunities
                  </h2>

                  <ShiurimCard shiurim={minyan.shiurim} />
                </div>
              )}

              {/* Additional Information Card */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-gray-100 dark:border-gray-700 mt-8">
                <div className="bg-primary/10 dark:bg-primary/20 px-4 py-3 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">Additional Information</h3>
                </div>

                <div className="p-4">
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Times may vary for holidays and special occasions. Please check with the shul directly for the most up-to-date information.
                  </p>

                  {minyan.phone && (
                    <div className="flex items-center mb-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <a href={`tel:${minyan.phone}`} className="text-primary hover:text-primary-dark transition-colors">
                        {minyan.phone}
                      </a>
                    </div>
                  )}

                  {minyan.website && (
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <a
                        href={minyan.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:text-primary-dark transition-colors"
                      >
                        Visit Website
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
