"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  MapPinIcon,
  UserIcon,
  PhoneIcon,
  GlobeAltIcon,
  ArrowLeftIcon,
  BuildingStorefrontIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';
import { Minyan } from '@/data/minyanim';

interface MinyanHeaderProps {
  minyan: Minyan;
}

const MinyanHeader: React.FC<MinyanHeaderProps> = ({ minyan }) => {
  const isShabbosOnly = minyan.shabbosOnly === true;

  return (
    <>
      {/* Back button */}
      <div className="flex items-center justify-between mb-8">
        <Link
          href="/minyanim"
          className="inline-flex items-center text-primary hover:text-primary-dark transition-all duration-300 hover:translate-x-[-4px] group"
        >
          <ArrowLeftIcon className="w-5 h-5 mr-2 group-hover:mr-3 transition-all duration-300" />
          <span className="font-medium">Back to Minyanim</span>
        </Link>

        <div className="hidden sm:flex items-center space-x-4">
          {minyan.phone && (
            <a
              href={`tel:${minyan.phone}`}
              className="inline-flex items-center text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary-light transition-colors duration-300"
            >
              <PhoneIcon className="h-5 w-5 mr-2" />
              <span>{minyan.phone}</span>
            </a>
          )}

          {minyan.website && (
            <a
              href={minyan.website}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary-light transition-colors duration-300"
            >
              <GlobeAltIcon className="h-5 w-5 mr-2" />
              <span>Website</span>
            </a>
          )}
        </div>
      </div>

      <div className={`rounded-2xl shadow-lg overflow-hidden mb-12 border ${isShabbosOnly
        ? 'bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/30 border-blue-200 dark:border-blue-800/30'
        : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700'}`}
      >
        {/* Hero image with overlay */}
        <div className="relative h-80 w-full">
          <Image
            src={minyan.imageUrl}
            alt={minyan.name}
            fill
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
            style={{ objectFit: 'cover' }}
            className="transition-transform duration-700 hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent"></div>

          {/* Minyan name and address overlay */}
          <div className="absolute bottom-0 left-0 p-8 text-white w-full">
            <div className="max-w-3xl">
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-white text-sm font-medium mb-4 ${isShabbosOnly ? 'bg-blue-500/90' : 'bg-primary/80'}`}>
                {isShabbosOnly ? (
                  <>
                    <CalendarIcon className="h-4 w-4 mr-1" />
                    <span>Shabbos Only</span>
                  </>
                ) : (
                  <>
                    <BuildingStorefrontIcon className="h-4 w-4 mr-1" />
                    <span>Shul</span>
                  </>
                )}
              </div>

              <h1 className="text-3xl md:text-5xl font-bold mb-3 text-white drop-shadow-md">
                {minyan.name}
              </h1>

              <div className="flex flex-wrap items-center text-white/90 text-lg">
                <div className="flex items-center mr-6 mb-2">
                  <MapPinIcon className="h-5 w-5 mr-2" />
                  <p>{minyan.address}</p>
                </div>

                {minyan.rabbi && (
                  <div className="flex items-center mb-2">
                    <UserIcon className="h-5 w-5 mr-2" />
                    <span>{minyan.rabbi}</span>
                  </div>
                )}
              </div>

              {isShabbosOnly && (
                <div className="mt-4 bg-blue-600/30 backdrop-blur-sm px-4 py-2 rounded-lg inline-block">
                  <p className="text-white text-sm">
                    This minyan operates on Shabbos only
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MinyanHeader;
