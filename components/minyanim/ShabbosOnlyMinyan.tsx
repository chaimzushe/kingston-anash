"use client";

import React from 'react';
import { Minyan } from '@/data/minyanim';
import {
  ClockIcon,
  BookOpenIcon,
  AcademicCapIcon,
  CalendarIcon,
  SunIcon
} from '@heroicons/react/24/outline';

interface ShabbosOnlyMinyanProps {
  minyan: Minyan;
}

const ShabbosOnlyMinyan: React.FC<ShabbosOnlyMinyanProps> = ({ minyan }) => {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/30 rounded-2xl shadow-lg overflow-hidden border border-blue-200 dark:border-blue-800/30 p-6 mb-8">
      {/* Shabbos Banner */}
      <div className="bg-blue-500 text-white px-6 py-4 -mx-6 -mt-6 mb-6 flex items-center">
        <CalendarIcon className="h-6 w-6 mr-3" />
        <h2 className="text-xl font-bold">Shabbos-Only Minyan</h2>
      </div>

      {/* Shabbos Schedule */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Left Column - Prayer Times */}
        <div>
          <h3 className="text-lg font-bold text-blue-800 dark:text-blue-300 mb-4 flex items-center">
            <SunIcon className="h-5 w-5 mr-2" />
            Shabbos Prayer Schedule
          </h3>

          <div className="space-y-4">
            {/* Chassidus */}
            {minyan.chassidus?.shabbos && (
              <div className="bg-indigo-100 dark:bg-indigo-900/30 rounded-xl p-4">
                <div className="flex items-center mb-2">
                  <BookOpenIcon className="h-5 w-5 mr-2 text-indigo-700 dark:text-indigo-300" />
                  <h4 className="font-bold text-indigo-800 dark:text-indigo-200">Chassidus</h4>
                </div>
                <p className="text-indigo-700 dark:text-indigo-300 ml-7">{minyan.chassidus?.shabbos}</p>
              </div>
            )}

            {/* Shachris */}
            {minyan.shachris?.shabbos && (
              <div className="bg-blue-100 dark:bg-blue-900/30 rounded-xl p-4">
                <div className="flex items-center mb-2">
                  <ClockIcon className="h-5 w-5 mr-2 text-blue-700 dark:text-blue-300" />
                  <h4 className="font-bold text-blue-800 dark:text-blue-200">Shachris</h4>
                </div>
                <p className="text-blue-700 dark:text-blue-300 ml-7">{minyan.shachris?.shabbos}</p>
              </div>
            )}

            {/* Mincha */}
            {minyan.mincha?.shabbos && (
              <div className="bg-green-100 dark:bg-green-900/30 rounded-xl p-4">
                <div className="flex items-center mb-2">
                  <ClockIcon className="h-5 w-5 mr-2 text-green-700 dark:text-green-300" />
                  <h4 className="font-bold text-green-800 dark:text-green-200">Mincha</h4>
                </div>
                <p className="text-green-700 dark:text-green-300 ml-7">{minyan.mincha?.shabbos}</p>
              </div>
            )}

            {/* Maariv */}
            {minyan.maariv?.shabbos && (
              <div className="bg-purple-100 dark:bg-purple-900/30 rounded-xl p-4">
                <div className="flex items-center mb-2">
                  <ClockIcon className="h-5 w-5 mr-2 text-purple-700 dark:text-purple-300" />
                  <h4 className="font-bold text-purple-800 dark:text-purple-200">Maariv</h4>
                </div>
                <p className="text-purple-700 dark:text-purple-300 ml-7">{minyan.maariv?.shabbos}</p>
              </div>
            )}

            {/* Kabbalat Shabbat */}
            {minyan.shabbos?.kabbalatShabbat && (
              <div className="bg-yellow-100 dark:bg-yellow-900/30 rounded-xl p-4">
                <div className="flex items-center mb-2">
                  <ClockIcon className="h-5 w-5 mr-2 text-yellow-700 dark:text-yellow-300" />
                  <h4 className="font-bold text-yellow-800 dark:text-yellow-200">Kabbalat Shabbat</h4>
                </div>
                <p className="text-yellow-700 dark:text-yellow-300 ml-7">{minyan.shabbos?.kabbalatShabbat}</p>
              </div>
            )}

            {/* Farbrengen */}
            {minyan.shabbos?.farbrengen && (
              <div className="bg-orange-100 dark:bg-orange-900/30 rounded-xl p-4">
                <div className="flex items-center mb-2">
                  <ClockIcon className="h-5 w-5 mr-2 text-orange-700 dark:text-orange-300" />
                  <h4 className="font-bold text-orange-800 dark:text-orange-200">Farbrengen</h4>
                </div>
                <p className="text-orange-700 dark:text-orange-300 ml-7">{minyan.shabbos?.farbrengen}</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Shiurim */}
        <div>
          {minyan.shiurim && minyan.shiurim.length > 0 && (
            <>
              <h3 className="text-lg font-bold text-blue-800 dark:text-blue-300 mb-4 flex items-center">
                <AcademicCapIcon className="h-5 w-5 mr-2" />
                Shabbos Learning
              </h3>

              <div className="space-y-4">
                {minyan.shiurim.map((shiur, index) => (
                  <div key={index} className="bg-amber-100 dark:bg-amber-900/30 rounded-xl p-4">
                    <h4 className="font-bold text-amber-800 dark:text-amber-200 mb-1">{shiur.title}</h4>
                    <div className="text-amber-700 dark:text-amber-300 text-sm space-y-1">
                      <p>{shiur.time}</p>
                      {shiur.description && <p>{shiur.description}</p>}
                      {shiur.rabbi && <p>Given by: {shiur.rabbi}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Note */}
      <div className="bg-blue-100 dark:bg-blue-900/20 border-l-4 border-blue-500 p-4 rounded-r-lg">
        <p className="text-blue-700 dark:text-blue-300 text-sm">
          This minyan operates on Shabbos only. Please contact the rabbi for more information about special events and holiday schedules.
        </p>
      </div>
    </div>
  );
};

export default ShabbosOnlyMinyan;
