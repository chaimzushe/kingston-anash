import React from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { minyanim } from '../../../data/minyanim';
import { PageHeader } from '../../../components/layout';

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
  
  return (
    <div className="min-h-screen py-6 px-4 sm:py-8 sm:px-6 lg:px-8 font-[family-name:var(--font-geist-sans)] pattern-overlay">
      <div className="max-w-4xl mx-auto">
        {/* Back button */}
        <Link 
          href="/" 
          className="inline-flex items-center text-primary hover:text-secondary transition-colors duration-150 mb-4 sm:mb-8"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          Back to Home
        </Link>

        {/* Minyan header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
            {minyan.name}
          </h1>
          <p className="text-gray-600 dark:text-gray-300">{minyan.address}</p>
          {minyan.rabbi && (
            <p className="text-gray-600 dark:text-gray-300 mt-1">Rabbi: {minyan.rabbi}</p>
          )}
        </div>

        {/* Featured image */}
        <div className="relative h-[250px] sm:h-[300px] md:h-[400px] w-full mb-6 sm:mb-8 rounded-lg overflow-hidden shadow-md">
          <Image 
            src={minyan.imageUrl} 
            alt={minyan.name}
            fill
            priority
            style={{ objectFit: 'cover' }}
          />
        </div>

        {/* Contact information */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6 mb-6 sm:mb-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Contact Information</h2>
          <div className="space-y-2">
            {minyan.phone && (
              <p className="flex items-center text-gray-600 dark:text-gray-300">
                <svg className="w-5 h-5 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                </svg>
                {minyan.phone}
              </p>
            )}
            {minyan.website && (
              <p className="flex items-center text-gray-600 dark:text-gray-300">
                <svg className="w-5 h-5 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <a 
                  href={minyan.website} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-primary hover:text-secondary transition-colors duration-150"
                >
                  {minyan.website.replace(/^https?:\/\//, '')}
                </a>
              </p>
            )}
          </div>
        </div>

        {/* Weekday prayer times */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6 mb-6 sm:mb-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Weekday Prayer Times</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {/* Shachris */}
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-primary mb-2">Shachris</h3>
              <div className="space-y-2">
                {minyan.shachris.sunday && (
                  <div>
                    <p className="font-medium text-gray-700 dark:text-gray-300">Sunday:</p>
                    <p className="text-gray-600 dark:text-gray-400">{minyan.shachris.sunday}</p>
                  </div>
                )}
                {minyan.shachris.mondayToThursday && (
                  <div>
                    <p className="font-medium text-gray-700 dark:text-gray-300">Monday-Thursday:</p>
                    <p className="text-gray-600 dark:text-gray-400">{minyan.shachris.mondayToThursday}</p>
                  </div>
                )}
                {minyan.shachris.friday && (
                  <div>
                    <p className="font-medium text-gray-700 dark:text-gray-300">Friday:</p>
                    <p className="text-gray-600 dark:text-gray-400">{minyan.shachris.friday}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Mincha */}
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-primary mb-2">Mincha</h3>
              <div className="space-y-2">
                {minyan.mincha.sunday && (
                  <div>
                    <p className="font-medium text-gray-700 dark:text-gray-300">Sunday:</p>
                    <p className="text-gray-600 dark:text-gray-400">{minyan.mincha.sunday}</p>
                  </div>
                )}
                {minyan.mincha.mondayToThursday && (
                  <div>
                    <p className="font-medium text-gray-700 dark:text-gray-300">Monday-Thursday:</p>
                    <p className="text-gray-600 dark:text-gray-400">{minyan.mincha.mondayToThursday}</p>
                  </div>
                )}
                {minyan.mincha.friday && (
                  <div>
                    <p className="font-medium text-gray-700 dark:text-gray-300">Friday:</p>
                    <p className="text-gray-600 dark:text-gray-400">{minyan.mincha.friday}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Maariv */}
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-primary mb-2">Maariv</h3>
              <div className="space-y-2">
                {minyan.maariv.sunday && (
                  <div>
                    <p className="font-medium text-gray-700 dark:text-gray-300">Sunday:</p>
                    <p className="text-gray-600 dark:text-gray-400">{minyan.maariv.sunday}</p>
                  </div>
                )}
                {minyan.maariv.mondayToThursday && (
                  <div>
                    <p className="font-medium text-gray-700 dark:text-gray-300">Monday-Thursday:</p>
                    <p className="text-gray-600 dark:text-gray-400">{minyan.maariv.mondayToThursday}</p>
                  </div>
                )}
                {minyan.maariv.friday && (
                  <div>
                    <p className="font-medium text-gray-700 dark:text-gray-300">Friday:</p>
                    <p className="text-gray-600 dark:text-gray-400">{minyan.maariv.friday}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Shabbos times */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6 mb-6 sm:mb-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Shabbos Times</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            {minyan.shabbos.candleLighting && (
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-primary mb-2">Candle Lighting</h3>
                <p className="text-gray-600 dark:text-gray-400">{minyan.shabbos.candleLighting}</p>
              </div>
            )}
            
            {minyan.shabbos.kabbalatShabbat && (
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-primary mb-2">Kabbalat Shabbat</h3>
                <p className="text-gray-600 dark:text-gray-400">{minyan.shabbos.kabbalatShabbat}</p>
              </div>
            )}
            
            {minyan.shabbos.shachris && (
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-primary mb-2">Shabbos Shachris</h3>
                <p className="text-gray-600 dark:text-gray-400">{minyan.shabbos.shachris}</p>
              </div>
            )}
            
            {minyan.shabbos.mincha && (
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-primary mb-2">Shabbos Mincha</h3>
                <p className="text-gray-600 dark:text-gray-400">{minyan.shabbos.mincha}</p>
              </div>
            )}
            
            {minyan.shabbos.maariv && (
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-primary mb-2">Shabbos Maariv</h3>
                <p className="text-gray-600 dark:text-gray-400">{minyan.shabbos.maariv}</p>
              </div>
            )}
            
            {minyan.shabbos.havdalah && (
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-primary mb-2">Havdalah</h3>
                <p className="text-gray-600 dark:text-gray-400">{minyan.shabbos.havdalah}</p>
              </div>
            )}
          </div>
        </div>

        {/* Note */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-primary p-4 rounded-r-lg mb-8">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700 dark:text-blue-200">
                Times may vary for holidays and special occasions. Please check with the shul directly for the most up-to-date information.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
