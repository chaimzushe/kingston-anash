"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { MapPinIcon, CalendarIcon } from '@heroicons/react/24/outline';
import { Giveaway } from '@/types/giveaways';
import ImageGallery from './ImageGallery';
import FallbackImage from './FallbackImage';

interface GiveawayCardProps {
  giveaway: Giveaway;
}

const GiveawayCard: React.FC<GiveawayCardProps> = ({ giveaway }) => {
  // State to track image loading errors
  const [imageError, setImageError] = useState(false);

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // No longer using condition badges

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-sm transition-all duration-300 flex flex-col h-full">
      {/* Image Gallery with Price Badge */}
      <div className="relative">
        {/* Image Gallery */}
        {giveaway.images && giveaway.images.length > 0 ? (
          <div className="relative">
            <ImageGallery
              images={giveaway.images}
              alt={giveaway.title}
            />
            {!giveaway.isAvailable && (
              <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center z-10">
                <span className="text-white font-bold text-lg">TAKEN</span>
              </div>
            )}
          </div>
        ) : giveaway.imageUrl ? (
          <div className="relative h-48 w-full">
            {!imageError ? (
              <Image
                src={giveaway.imageUrl}
                alt={giveaway.title}
                fill
                className="object-cover"
                onError={() => setImageError(true)}
              />
            ) : (
              <FallbackImage title={giveaway.title} />
            )}
            {!giveaway.isAvailable && (
              <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
                <span className="text-white font-bold text-lg">TAKEN</span>
              </div>
            )}
          </div>
        ) : (
          <div className="h-48 w-full">
            <FallbackImage title={giveaway.title} />
            {!giveaway.isAvailable && (
              <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
                <span className="text-white font-bold text-lg">TAKEN</span>
              </div>
            )}
          </div>
        )}

        {/* Price Badge - Positioned on the image */}
        <div className="absolute top-2 right-2">
          {giveaway.price && giveaway.price > 0 ? (
            <div className="bg-primary text-white px-3 py-1 rounded-full font-medium text-sm">
              ${giveaway.price}
            </div>
          ) : (
            <div className="bg-green-500 text-white px-3 py-1 rounded-full font-medium text-sm">
              Free
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-grow flex flex-col">
        <div className="mb-3">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white line-clamp-1">
            {giveaway.title}
          </h3>
        </div>

        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
          {giveaway.description}
        </p>

        <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
          <div className="flex items-center">
            <MapPinIcon className="w-4 h-4 mr-2 text-gray-400" />
            <span className="truncate">{giveaway.location}</span>
          </div>

          <div className="flex items-center">
            <CalendarIcon className="w-4 h-4 mr-2 text-gray-400" />
            <span>Posted {formatDate(giveaway.postedDate)}</span>
          </div>

          {/* Tags removed as requested */}
        </div>

        {/* Contact Info */}
        {giveaway.isAvailable && (
          <div className="mt-auto pt-6 mt-6 border-t border-gray-100 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Contact: {giveaway.contactName}
            </p>
            {giveaway.contactEmail && (
              <p className="text-sm text-primary">
                <a href={`mailto:${giveaway.contactEmail}`} className="hover:underline">
                  {giveaway.contactEmail}
                </a>
              </p>
            )}
            {giveaway.contactPhone && (
              <p className="text-sm text-primary">
                <a href={`tel:${giveaway.contactPhone.replace(/[^0-9]/g, '')}`} className="hover:underline">
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
