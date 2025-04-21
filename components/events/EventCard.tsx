"use client";

import React from 'react';
import { ClockIcon, MapPinIcon, UserIcon } from '@heroicons/react/24/outline';
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

  // Format duration for display
  const formatDuration = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} min`;
    } else if (minutes === 60) {
      return '1 hour';
    } else if (minutes % 60 === 0) {
      return `${minutes / 60} hours`;
    } else {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      return `${hours} hr ${remainingMinutes} min`;
    }
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
            <span>
              {formatTime(event.startTime)}
              {event.duration ? ` (${formatDuration(event.duration)})` : ` - ${formatTime(event.endTime)}`}
            </span>
          </div>

          <div className="flex items-center">
            <MapPinIcon className="w-4 h-4 mr-2 text-gray-400" />
            <span>{event.location}</span>
          </div>

          <div className="flex items-center">
            <UserIcon className="w-4 h-4 mr-2 text-gray-400" />
            <span>
              {event.gender === 'men' ? 'Men Only' :
               event.gender === 'women' ? 'Women Only' :
               'Everyone Welcome'}
            </span>
          </div>
        </div>

        {event.description && (
          <p className="mt-3 text-gray-600 dark:text-gray-300 line-clamp-2">
            {event.description}
          </p>
        )}

        {event.creator && (
          <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">
            Created by {event.creator.name}
          </div>
        )}
      </div>
    </div>
  );
};

export default EventCard;
