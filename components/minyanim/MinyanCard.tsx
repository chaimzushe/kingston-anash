"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Minyan } from '@/data/minyanim';
import {
  ClockIcon,
  MapPinIcon,
  UserIcon,
  BookOpenIcon,
  AcademicCapIcon,
  BuildingStorefrontIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';

interface MinyanCardProps {
  minyan: Minyan;
}

const MinyanCard: React.FC<MinyanCardProps> = ({ minyan }) => {
  const isShabbosOnly = minyan.shabbosOnly === true;

  return (
    <Link
      href={`/minyanim/${minyan.id}`}
      className={`group rounded-2xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:translate-y-[-4px] flex flex-col h-full border ${isShabbosOnly
        ? 'bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/30 border-blue-200 dark:border-blue-800/30'
        : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700'}`}
    >
      <div className="relative h-52 w-full overflow-hidden">
        <Image
          src={minyan.imageUrl}
          alt={minyan.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          style={{ objectFit: 'cover' }}
          className="transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent"></div>

        {/* Badge */}
        <div className="absolute top-4 left-4">
          <div className={`inline-flex items-center px-2.5 py-1 rounded-full text-white text-xs font-medium ${isShabbosOnly ? 'bg-blue-500/90' : 'bg-primary/80'}`}>
            {isShabbosOnly ? (
              <>
                <CalendarIcon className="h-3.5 w-3.5 mr-1" />
                <span>Shabbos Only</span>
              </>
            ) : (
              <>
                <BuildingStorefrontIcon className="h-3.5 w-3.5 mr-1" />
                <span>Shul</span>
              </>
            )}
          </div>
        </div>

        <div className="absolute bottom-0 left-0 p-5 text-white w-full">
          <h2 className="text-xl font-bold mb-2 group-hover:text-primary-light transition-colors duration-300">{minyan.name}</h2>
          <div className="flex items-center text-sm text-white/90">
            <MapPinIcon className="h-4 w-4 mr-1.5 flex-shrink-0" />
            <p className="truncate">{minyan.address}</p>
          </div>
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col">
        <div className="flex-1">
          {/* Prayer Times */}
          <div className="flex flex-wrap gap-2 mb-5">
            {isShabbosOnly ? (
              <>
                {minyan.chassidus?.shabbos && (
                  <div className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-200 px-3 py-1.5 rounded-full text-xs font-medium flex items-center">
                    <BookOpenIcon className="h-3.5 w-3.5 mr-1" />
                    Shabbos Chassidus
                  </div>
                )}
                {minyan.shachris.shabbos && (
                  <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-200 px-3 py-1.5 rounded-full text-xs font-medium flex items-center">
                    <ClockIcon className="h-3.5 w-3.5 mr-1" />
                    Shabbos Shachris
                  </div>
                )}
                {minyan.mincha.shabbos && (
                  <div className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-200 px-3 py-1.5 rounded-full text-xs font-medium flex items-center">
                    <ClockIcon className="h-3.5 w-3.5 mr-1" />
                    Shabbos Mincha
                  </div>
                )}
              </>
            ) : (
              <>
                {minyan.chassidus && (
                  <div className="bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-200 px-3 py-1.5 rounded-full text-xs font-medium flex items-center">
                    <BookOpenIcon className="h-3.5 w-3.5 mr-1" />
                    Chassidus
                  </div>
                )}
                {minyan.shachris.mondayToFriday && (
                  <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-200 px-3 py-1.5 rounded-full text-xs font-medium flex items-center">
                    <ClockIcon className="h-3.5 w-3.5 mr-1" />
                    Shachris
                  </div>
                )}
                {minyan.mincha.mondayToFriday && (
                  <div className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-200 px-3 py-1.5 rounded-full text-xs font-medium flex items-center">
                    <ClockIcon className="h-3.5 w-3.5 mr-1" />
                    Mincha
                  </div>
                )}
                {minyan.maariv.mondayToFriday && (
                  <div className="bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-200 px-3 py-1.5 rounded-full text-xs font-medium flex items-center">
                    <ClockIcon className="h-3.5 w-3.5 mr-1" />
                    Maariv
                  </div>
                )}
              </>
            )}
          </div>

          {/* Shiurim */}
          {minyan.shiurim && minyan.shiurim.length > 0 && (
            <div className="mb-4">
              <div className="flex items-center text-sm text-gray-700 dark:text-gray-300 mb-2">
                <AcademicCapIcon className="h-4 w-4 mr-1.5 text-amber-500" />
                <span className="font-medium">
                  {isShabbosOnly ? 'Shabbos Learning' : 'Daily Shiurim Available'}
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {minyan.shiurim.length} learning {minyan.shiurim.length === 1 ? 'opportunity' : 'opportunities'} available
              </p>
            </div>
          )}
        </div>

        <div className="flex justify-between items-center mt-2 pt-3 border-t border-gray-200 dark:border-gray-700">
          {minyan.rabbi && (
            <div className="flex items-center text-xs text-gray-600 dark:text-gray-400">
              <UserIcon className="h-3.5 w-3.5 mr-1.5 flex-shrink-0" />
              <span className="truncate">{minyan.rabbi}</span>
            </div>
          )}
          <span className="text-sm font-medium text-primary hover:text-primary-dark transition-colors duration-150 group-hover:translate-x-1 transition-transform duration-300">
            View details →
          </span>
        </div>
      </div>
    </Link>
  );
};

export default MinyanCard;
