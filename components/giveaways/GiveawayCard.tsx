"use client";

import React from 'react';
import Image from 'next/image';
import { MapPinIcon, CalendarIcon, TagIcon } from '@heroicons/react/24/outline';
import { Giveaway } from '@/types/giveaways';

interface GiveawayCardProps {
  giveaway: Giveaway;
}

const GiveawayCard: React.FC<GiveawayCardProps> = ({ giveaway }) => {
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };
  
  // Get condition badge color
  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'New':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'Like New':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'Good':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'Fair':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300';
      case 'Poor':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Image */}
      {giveaway.imageUrl ? (
        <div className="relative h-48 w-full">
          <Image
            src={giveaway.imageUrl}
            alt={giveaway.title}
            fill
            className="object-cover"
          />
          {!giveaway.isAvailable && (
            <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
              <span className="text-white font-bold text-lg">TAKEN</span>
            </div>
          )}
        </div>
      ) : (
        <div className="h-48 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
          <span className="text-gray-500 dark:text-gray-400">No Image</span>
          {!giveaway.isAvailable && (
            <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
              <span className="text-white font-bold text-lg">TAKEN</span>
            </div>
          )}
        </div>
      )}
      
      {/* Content */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            {giveaway.title}
          </h3>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getConditionColor(giveaway.condition)}`}>
            {giveaway.condition}
          </span>
        </div>
        
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
          {giveaway.description}
        </p>
        
        <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
          <div className="flex items-center">
            <MapPinIcon className="w-4 h-4 mr-2 text-gray-400" />
            <span>{giveaway.location}</span>
          </div>
          
          <div className="flex items-center">
            <CalendarIcon className="w-4 h-4 mr-2 text-gray-400" />
            <span>Posted {formatDate(giveaway.postedDate)}</span>
          </div>
          
          {giveaway.tags && giveaway.tags.length > 0 && (
            <div className="flex items-start">
              <TagIcon className="w-4 h-4 mr-2 text-gray-400 mt-0.5" />
              <div className="flex flex-wrap gap-1">
                {giveaway.tags.map((tag) => (
                  <span 
                    key={tag} 
                    className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Contact Info */}
        {giveaway.isAvailable && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
              Contact Information
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {giveaway.contactName}
            </p>
            {giveaway.contactEmail && (
              <p className="text-sm text-primary">
                <a href={`mailto:${giveaway.contactEmail}`}>
                  {giveaway.contactEmail}
                </a>
              </p>
            )}
            {giveaway.contactPhone && (
              <p className="text-sm text-primary">
                <a href={`tel:${giveaway.contactPhone.replace(/[^0-9]/g, '')}`}>
                  {giveaway.contactPhone}
                </a>
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default GiveawayCard;
