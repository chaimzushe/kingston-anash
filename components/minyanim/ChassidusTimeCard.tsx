"use client";

import React from 'react';
import { BookOpenIcon } from '@heroicons/react/24/outline';
import { MinyanTime } from '@/data/minyanim';

interface ChassidusTimeCardProps {
  times: MinyanTime;
}

const ChassidusTimeCard: React.FC<ChassidusTimeCardProps> = ({ times }) => {
  if (!times) return null;
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-gray-100 dark:border-gray-700 transform transition-all duration-300 hover:shadow-md">
      <div className="bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-200 px-4 py-3 flex items-center">
        <BookOpenIcon className="h-5 w-5 mr-2 text-indigo-500" />
        <h3 className="text-lg font-bold">Chassidus</h3>
      </div>
      
      <div className="p-4">
        <div className="space-y-3">
          {times.sunday && (
            <div className="flex">
              <div className="w-1/3 font-medium text-gray-700 dark:text-gray-300">Sunday:</div>
              <div className="w-2/3 text-gray-600 dark:text-gray-400">{times.sunday}</div>
            </div>
          )}
          
          {times.mondayToFriday && (
            <div className="flex">
              <div className="w-1/3 font-medium text-gray-700 dark:text-gray-300">Mon-Fri:</div>
              <div className="w-2/3 text-gray-600 dark:text-gray-400">{times.mondayToFriday}</div>
            </div>
          )}
          
          {times.shabbos && (
            <div className="flex">
              <div className="w-1/3 font-medium text-gray-700 dark:text-gray-300">Shabbos:</div>
              <div className="w-2/3 text-gray-600 dark:text-gray-400">{times.shabbos}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChassidusTimeCard;
