"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PageHeader } from '@/components/layout';
import Calendar from '@/components/events/Calendar';
import EventList from '@/components/events/EventList';
import EventCard from '@/components/events/EventCard';
import { dummyEvents } from '@/data/eventsData';
import { Event } from '@/types/events';
import { useUser } from '@clerk/nextjs';

export default function EventsPage() {
  const router = useRouter();
  const { isSignedIn, isLoaded } = useUser();

  // State for selected date (default to today)
  const [selectedDate, setSelectedDate] = useState(new Date());
  // State for filtered events
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  // State for mobile view
  const [isMobileView, setIsMobileView] = useState(false);

  // Client-side authentication check as a backup
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      console.log('User not signed in, redirecting to sign-in page');
      router.push('/auth/signin?redirect_url=/community/events');
    }
  }, [isLoaded, isSignedIn, router]);

  // Handle date selection
  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  // Filter events for the selected date
  useEffect(() => {
    const filtered = dummyEvents.filter(event => {
      const eventDate = new Date(event.date);
      return (
        eventDate.getDate() === selectedDate.getDate() &&
        eventDate.getMonth() === selectedDate.getMonth() &&
        eventDate.getFullYear() === selectedDate.getFullYear()
      );
    });

    // Sort events by start time
    const sorted = [...filtered].sort((a, b) => {
      return a.startTime.localeCompare(b.startTime);
    });

    setFilteredEvents(sorted);
  }, [selectedDate]);

  // Check if we're in mobile view
  useEffect(() => {
    const checkMobileView = () => {
      setIsMobileView(window.innerWidth < 1024);
    };

    // Initial check
    checkMobileView();

    // Add event listener for window resize
    window.addEventListener('resize', checkMobileView);

    // Cleanup
    return () => window.removeEventListener('resize', checkMobileView);
  }, []);

  // If still loading authentication status, show loading spinner
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, show a message
  if (!isSignedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-4">
            <p className="font-bold">Authentication Required</p>
            <p>You need to be signed in to access this page.</p>
          </div>
          <a
            href="/auth/signin?redirect_url=/community/events"
            className="mt-4 inline-block px-6 py-3 bg-primary text-white rounded-md"
          >
            Sign In
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 pattern-overlay">
      <div className="max-w-7xl mx-auto">
        <PageHeader
          title="Community Events"
          subtitle="View and join upcoming events in our community"
        />

        {/* Desktop View */}
        {!isMobileView ? (
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Calendar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <Calendar
                  onDateSelect={handleDateSelect}
                  selectedDate={selectedDate}
                  events={dummyEvents.map(event => ({ date: new Date(event.date) }))}
                />
              </div>
            </div>

            {/* Event List */}
            <div className="lg:col-span-2">
              <EventList
                events={dummyEvents}
                date={selectedDate}
              />
            </div>
          </div>
        ) : (
          /* Mobile View */
          <div className="mt-8 space-y-6">
            {/* Calendar */}
            <div className="mx-auto max-w-md">
              <Calendar
                onDateSelect={handleDateSelect}
                selectedDate={selectedDate}
                events={dummyEvents.map(event => ({ date: new Date(event.date) }))}
              />
            </div>

            {/* Selected Date Header */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
              <div className="px-5 py-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Events for {selectedDate.toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric'
                  })}
                </h2>
              </div>
            </div>

            {/* Event Cards */}
            {filteredEvents.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {filteredEvents.map(event => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
                <p className="text-gray-500 dark:text-gray-400">No events scheduled for this day.</p>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Select another date or check back later.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
