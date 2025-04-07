"use client";

import React from 'react';
import { ClockIcon, MapPinIcon } from '@heroicons/react/24/outline';
import { Event } from '@/types/events';

interface EventCardProps {
  event: Event;
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  // Format time for display
  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="p-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          {event.title}
        </h3>
        
        <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
          <div className="flex items-center">
            <ClockIcon className="w-4 h-4 mr-2 text-gray-400" />
            <span>{formatTime(event.startTime)} - {formatTime(event.endTime)}</span>
          </div>
          
          <div className="flex items-center">
            <MapPinIcon className="w-4 h-4 mr-2 text-gray-400" />
            <span>{event.location}</span>
          </div>
        </div>
        
        {event.description && (
          <p className="mt-3 text-gray-600 dark:text-gray-300 line-clamp-2">
            {event.description}
          </p>
        )}
        
        {event.tags && event.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {event.tags.slice(0, 2).map((tag) => (
              <span 
                key={tag} 
                className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary"
              >
                {tag}
              </span>
            ))}
            {event.tags.length > 2 && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                +{event.tags.length - 2}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EventCard;
