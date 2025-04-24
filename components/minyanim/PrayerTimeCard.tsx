"use client";

import React from 'react';
import { ClockIcon } from '@heroicons/react/24/outline';
import { MinyanTime } from '@/data/minyanim';

interface PrayerTimeCardProps {
  title: string;
  times: MinyanTime;
  colorClass: string;
  iconClass: string;
}

const PrayerTimeCard: React.FC<PrayerTimeCardProps> = ({
  title,
  times,
  colorClass,
  iconClass
}) => {
  // Handle case where times might be undefined
  if (!times) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-gray-100 dark:border-gray-700">
        <div className={`${colorClass} px-4 py-3 flex items-center`}>
          <ClockIcon className={`h-5 w-5 mr-2 ${iconClass}`} />
          <h3 className="text-lg font-bold">{title}</h3>
        </div>
        <div className="p-4">
          <div className="text-gray-500 dark:text-gray-400 italic">No times available</div>
        </div>
      </div>
    );
  }
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-gray-100 dark:border-gray-700">
      <div className={`${colorClass} px-4 py-3 flex items-center`}>
        <ClockIcon className={`h-5 w-5 mr-2 ${iconClass}`} />
        <h3 className="text-lg font-bold">{title}</h3>
      </div>

      <div className="p-4">
        <div className="space-y-3">
          {times && times.sunday && (
            <div className="flex">
              <div className="w-1/3 font-medium text-gray-700 dark:text-gray-300">Sunday:</div>
              <div className="w-2/3 text-gray-600 dark:text-gray-400">{times.sunday}</div>
            </div>
          )}

          {times && times.mondayToFriday && (
            <div className="flex">
              <div className="w-1/3 font-medium text-gray-700 dark:text-gray-300">Mon-Fri:</div>
              <div className="w-2/3 text-gray-600 dark:text-gray-400">{times.mondayToFriday}</div>
            </div>
          )}

          {times && times.shabbos && (
            <div className="flex">
              <div className="w-1/3 font-medium text-gray-700 dark:text-gray-300">Shabbos:</div>
              <div className="w-2/3 text-gray-600 dark:text-gray-400">{times.shabbos}</div>
            </div>
          )}

          {(!times || (!times.sunday && !times.mondayToFriday && !times.shabbos)) && (
            <div className="text-gray-500 dark:text-gray-400 italic">No times available</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PrayerTimeCard;
