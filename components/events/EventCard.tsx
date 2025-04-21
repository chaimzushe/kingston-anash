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

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  // Determine gender badge color
  const genderBadgeColor = () => {
    switch(event.gender) {
      case 'men': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'women': return 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200';
      default: return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-100 dark:border-gray-700 transform hover:-translate-y-1">
      {/* Card Header with Title and Date */}
      <div className="p-4 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-primary/10 to-transparent">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {event.title}
          </h3>
          <span className="text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-2 py-1 rounded-md">
            {formatDate(event.date)}
          </span>
        </div>
      </div>

      {/* Card Body with Event Details */}
      <div className="p-4">
        <div className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
          {/* Time */}
          <div className="flex items-center">
            <ClockIcon className="w-4 h-4 mr-2 text-primary" />
            <span className="font-medium">
              {formatTime(event.startTime)}
              {event.duration ? ` (${formatDuration(event.duration)})` : ` - ${formatTime(event.endTime)}`}
            </span>
          </div>

          {/* Location */}
          <div className="flex items-center">
            <MapPinIcon className="w-4 h-4 mr-2 text-primary" />
            <span>{event.location}</span>
          </div>

          {/* Gender Badge */}
          <div className="flex items-center">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${genderBadgeColor()}`}>
              {event.gender === 'men' ? 'Men Only' :
               event.gender === 'women' ? 'Women Only' :
               'Everyone Welcome'}
            </span>
          </div>
        </div>

        {/* Description */}
        {event.description && (
          <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-750 rounded-md">
            <p className="text-gray-600 dark:text-gray-300 line-clamp-2 text-sm">
              {event.description}
            </p>
          </div>
        )}
      </div>

      {/* Card Footer with Creator Info */}
      {event.creator && (
        <div className="px-4 py-2 bg-gray-50 dark:bg-gray-750 border-t border-gray-100 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400 flex items-center">
          <UserIcon className="w-3 h-3 mr-1 text-gray-400" />
          Created by {event.creator.name}
        </div>
      )}
    </div>
  );
};

export default EventCard;
