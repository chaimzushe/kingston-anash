import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { minyanim } from '../../data/minyanim';
import { PageHeader } from '../../components/layout';

export const metadata = {
  title: 'Minyanim | Kingston Anash',
  description: 'Find prayer times and information for local minyanim in the Kingston Anash community.',
};

export default function MinyanListPage() {
  return (
    <div className="min-h-screen py-6 px-4 sm:py-8 sm:px-6 lg:px-8 font-[family-name:var(--font-geist-sans)] pattern-overlay">
      <div className="max-w-7xl mx-auto">
        <PageHeader 
          title="Minyanim"
          subtitle="Find prayer times and information for local minyanim in our community"
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {minyanim.map((minyan) => (
            <Link 
              key={minyan.id} 
              href={`/minyanim/${minyan.id}`}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg hover:translate-y-[-4px]"
            >
              <div className="relative h-48 w-full">
                <Image 
                  src={minyan.imageUrl} 
                  alt={minyan.name}
                  fill
                  style={{ objectFit: 'cover' }}
                  className="transition-transform duration-500 hover:scale-110"
                />
              </div>
              <div className="p-4 sm:p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{minyan.name}</h2>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">{minyan.address}</p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="bg-accent/20 dark:bg-accent/30 text-accent-700 dark:text-accent-200 px-2 py-1 rounded-full text-xs font-medium">
                    Shachris
                  </span>
                  <span className="bg-accent/20 dark:bg-accent/30 text-accent-700 dark:text-accent-200 px-2 py-1 rounded-full text-xs font-medium">
                    Mincha
                  </span>
                  <span className="bg-accent/20 dark:bg-accent/30 text-accent-700 dark:text-accent-200 px-2 py-1 rounded-full text-xs font-medium">
                    Maariv
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  {minyan.rabbi && (
                    <span className="text-xs text-gray-500 dark:text-gray-400">Rabbi: {minyan.rabbi}</span>
                  )}
                  <span className="text-sm font-medium text-primary hover:text-secondary transition-colors duration-150">
                    View details →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
