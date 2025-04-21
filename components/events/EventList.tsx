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

  // Filter events for the selected date
  const filteredEvents = events.filter(event => {
    // Convert dates to YYYY-MM-DD format for comparison to avoid timezone issues
    const eventDateStr = event.date.split('T')[0];
    const selectedDateStr = date.toISOString().split('T')[0];
    return eventDateStr === selectedDateStr;
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
          sortedEvents.map((event) => {
            // Determine gender badge color
            const genderBadgeColor = () => {
              switch(event.gender) {
                case 'men': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
                case 'women': return 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200';
                default: return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
              }
            };

            return (
              <div key={event._id} className="p-4 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {event.title}
                  </h3>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${genderBadgeColor()}`}>
                    {event.gender === 'men' ? 'Men Only' :
                     event.gender === 'women' ? 'Women Only' :
                     'Everyone Welcome'}
                  </span>
                </div>

                <div className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
                  <div className="flex items-center">
                    <ClockIcon className="w-4 h-4 mr-2 text-primary" />
                    <span className="font-medium">
                      {formatTime(event.startTime)}
                      {event.duration ? ` (${formatDuration(event.duration)})` : ` - ${formatTime(event.endTime)}`}
                    </span>
                  </div>

                  <div className="flex items-center">
                    <MapPinIcon className="w-4 h-4 mr-2 text-primary" />
                    <span>{event.location}</span>
                  </div>
                </div>

                {event.description && (
                  <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-750 rounded-md">
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      {event.description}
                    </p>
                  </div>
                )}

                {event.creator && (
                  <div className="mt-3 text-xs text-gray-500 dark:text-gray-400 flex items-center">
                    <UserIcon className="w-3 h-3 mr-1 text-gray-400" />
                    Created by {event.creator.name}
                  </div>
                )}
              </div>
            );
          })
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
