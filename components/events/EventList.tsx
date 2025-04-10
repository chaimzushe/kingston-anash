"use client";

import React from 'react';
import { ClockIcon, MapPinIcon, UserIcon } from '@heroicons/react/24/outline';
import { Event } from '@/types/events';

interface EventListProps {
  events: Event[];
  date: Date;
}

const EventList: React.FC<EventListProps> = ({ events, date }) => {
  // Format date for display
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Format time for display
  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  // Filter events for the selected date
  const filteredEvents = events.filter(event => {
    const eventDate = new Date(event.date);
    return (
      eventDate.getDate() === date.getDate() &&
      eventDate.getMonth() === date.getMonth() &&
      eventDate.getFullYear() === date.getFullYear()
    );
  });

  // Sort events by start time
  const sortedEvents = [...filteredEvents].sort((a, b) => {
    return a.startTime.localeCompare(b.startTime);
  });

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden h-full">
      <div className="px-5 py-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Events for {formatDate(date)}
        </h2>
      </div>

      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {sortedEvents.length > 0 ? (
          sortedEvents.map((event) => (
            <div key={event._id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
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

                <div className="flex items-center">
                  <UserIcon className="w-4 h-4 mr-2 text-gray-400" />
                  <span>
                    {event.gender === 'men' ? 'Men Only' :
                     event.gender === 'women' ? 'Women Only' :
                     'Everyone Welcome'}
                  </span>
                </div>

                {event.creator && (
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Created by {event.creator.name}
                  </div>
                )}
              </div>

              {event.description && (
                <p className="mt-3 text-gray-600 dark:text-gray-300">
                  {event.description}
                </p>
              )}


            </div>
          ))
        ) : (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">
            <p>No events scheduled for this day.</p>
            <p className="mt-1 text-sm">Select another date or check back later.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventList;
