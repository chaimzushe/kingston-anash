"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { getMockEvents } from '@/lib/mockEvents';
import { useRouter } from 'next/navigation';
import { PageHeader } from '@/components/layout';
import Calendar from '@/components/events/Calendar';
import EventList from '@/components/events/EventList';
import EventCard from '@/components/events/EventCard';
import EventForm from '@/components/events/EventForm';
import { Event } from '@/types/events';
import { useUser, useAuth } from '@clerk/nextjs';
import { PlusIcon } from '@heroicons/react/24/outline';

export default function EventsPage() {
  const router = useRouter();
  const { isSignedIn, isLoaded, user } = useUser();

  // No longer checking for member role
  // All authenticated users can create events

  // State for selected date (default to today)
  const [selectedDate, setSelectedDate] = useState(new Date());
  // State for events
  const [events, setEvents] = useState<Event[]>([]);
  // State for filtered events
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  // State for mobile view
  const [isMobileView, setIsMobileView] = useState(false);
  // State for loading
  const [isLoading, setIsLoading] = useState(true);
  // State for error
  const [error, setError] = useState<string | null>(null);
  // State for showing event form
  const [showEventForm, setShowEventForm] = useState(false);

  // Fetch events from API
  const fetchEvents = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/community/events');

      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }

      const data = await response.json();
      console.log('Fetched events from API:', data.events?.length || 0, 'events');

      // Get mock events from localStorage (client-side only)
      const mockEvents = getMockEvents();
      console.log('Fetched mock events from localStorage:', mockEvents.length, 'events');

      // Combine API events and mock events
      const allEvents = [...(data.events || []), ...mockEvents];

      // Sort events by date and start time
      const sortedEvents = allEvents.sort((a, b) => {
        // First sort by date
        const dateComparison = a.date.localeCompare(b.date);
        if (dateComparison !== 0) return dateComparison;

        // Then sort by start time
        return a.startTime.localeCompare(b.startTime);
      });

      console.log('Combined events:', sortedEvents.length, 'total events');
      setEvents(sortedEvents);
    } catch (error) {
      console.error('Error fetching events:', error);
      setError('Failed to load events. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Client-side authentication check as a backup
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      console.log('User not signed in, redirecting to sign-in page');
      router.push('/auth/signin?redirect_url=/community/events');
    } else if (isLoaded && isSignedIn) {
      // If user is signed in, fetch events
      fetchEvents();
    }
  }, [isLoaded, isSignedIn, router, fetchEvents]);

  // Fetch events when component mounts, regardless of auth state
  useEffect(() => {
    if (isLoaded) {
      fetchEvents();
    }
  }, [isLoaded, fetchEvents]);

  // Handle date selection
  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  // Filter events for the selected date
  useEffect(() => {
    if (events.length > 0) {
      const filtered = events.filter(event => {
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
      console.log('Filtered events for selected date:', sorted.length, 'events');
    } else {
      setFilteredEvents([]);
      console.log('No events to filter');
    }
  }, [selectedDate, events]);

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

  // Handle event creation
  const handleEventCreated = async () => {
    // Wait a moment to ensure the event is saved
    await new Promise(resolve => setTimeout(resolve, 500));

    // Refresh the events list
    await fetchEvents();

    // Hide the event form
    setShowEventForm(false);

    // Log for debugging
    console.log('Events refreshed after creation');

    // Force a re-render by updating the state
    setEvents(prev => [...prev]);
  };

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
        <div className="flex flex-col md:flex-row md:justify-between md:items-center">
          <PageHeader
            title="Community Events"
            subtitle="View and join upcoming events in our community"
          />

          {isLoaded && isSignedIn ? (
            <button
              onClick={() => setShowEventForm(!showEventForm)}
              className="mt-4 md:mt-0 px-4 py-2 bg-gradient-primary text-white font-medium rounded-md shadow-sm transition-all duration-200 hover:opacity-90 hover:shadow-md flex items-center justify-center"
            >
              {showEventForm ? (
                'Cancel'
              ) : (
                <>
                  <PlusIcon className="w-5 h-5 mr-1" />
                  Create Event
                </>
              )}
            </button>
          ) : null}
        </div>

        {/* Event creation form */}
        {showEventForm && (
          <div className="mt-8">
            <EventForm onEventCreated={handleEventCreated} />
          </div>
        )}

        {/* Desktop View */}
        {!isMobileView ? (
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Calendar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <Calendar
                  onDateSelect={handleDateSelect}
                  selectedDate={selectedDate}
                  events={events.map(event => ({ date: new Date(event.date) }))}
                />
              </div>
            </div>

            {/* Event List */}
            <div className="lg:col-span-2">
              {isLoading ? (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 flex justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                </div>
              ) : error ? (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center text-red-500">
                  {error}
                </div>
              ) : (
                <EventList
                  events={events}
                  date={selectedDate}
                />
              )}
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
                events={events.map(event => ({ date: new Date(event.date) }))}
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
            {isLoading ? (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 flex justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : error ? (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center text-red-500">
                {error}
              </div>
            ) : filteredEvents.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {filteredEvents.map(event => (
                  <EventCard key={event._id} event={event} />
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
