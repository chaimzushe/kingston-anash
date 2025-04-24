"use client";

import React from 'react';
import { AcademicCapIcon, ClockIcon, UserIcon } from '@heroicons/react/24/outline';

interface Shiur {
  title: string;
  time: string;
  description?: string;
  rabbi?: string;
}

interface ShiurimCardProps {
  shiurim: Shiur[];
}

const ShiurimCard: React.FC<ShiurimCardProps> = ({ shiurim }) => {
  if (!shiurim || shiurim.length === 0) return null;
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-gray-100 dark:border-gray-700 transform transition-all duration-300 hover:shadow-md">
      <div className="bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-200 px-4 py-3 flex items-center">
        <AcademicCapIcon className="h-5 w-5 mr-2 text-amber-500" />
        <h3 className="text-lg font-bold">Daily Shiurim</h3>
      </div>
      
      <div className="divide-y divide-gray-100 dark:divide-gray-700">
        {shiurim.map((shiur, index) => (
          <div key={index} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors duration-150">
            <h4 className="font-bold text-gray-900 dark:text-white mb-1">{shiur.title}</h4>
            
            <div className="space-y-2 mt-2">
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <ClockIcon className="h-4 w-4 mr-2 text-gray-400 dark:text-gray-500" />
                <span>{shiur.time}</span>
              </div>
              
              {shiur.rabbi && (
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <UserIcon className="h-4 w-4 mr-2 text-gray-400 dark:text-gray-500" />
                  <span>{shiur.rabbi}</span>
                </div>
              )}
              
              {shiur.description && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {shiur.description}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShiurimCard;
