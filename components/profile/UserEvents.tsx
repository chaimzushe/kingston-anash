"use client";

import React, { useState, useEffect } from 'react';
import { Event } from '@/types/events';
import { useUser } from '@clerk/nextjs';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import EventForm from '@/components/events/EventForm';

interface UserEventsProps {
  userId: string;
}

const UserEvents: React.FC<any> = ({ userId }) => {
  const { user } = useUser();
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Fetch user events from Sanity API
  const fetchUserEvents = async (forceRefresh = false) => {
    // Only set loading to true on initial load, not on refreshes
    if (events.length === 0) {
      setIsLoading(true);
    }
    setError(null);

    try {
      console.log('Fetching user events for user ID:', userId, forceRefresh ? '(forced refresh)' : '');

      // Add a cache-busting parameter to force a fresh fetch when needed
      const cacheBuster = forceRefresh ? `&_t=${Date.now()}` : '';

      // Fetch events from the Sanity API
      const response = await fetch(`/api/community/events/user-client?userId=${userId}${cacheBuster}`, {
        // Add cache control headers to ensure we get fresh data
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });

      // Log the response status
      console.log('API response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API error response:', errorText);
        throw new Error(`Failed to fetch events: ${response.status} ${errorText}`);
      }

      const data = await response.json();
      console.log('Fetched events from API:', data.events?.length || 0);
      console.log('API response timestamp:', data.timestamp);
      console.log('API response source:', data.source || 'unknown');

      // Sort events by date (descending) and start time
      const sortedEvents = (data.events || []).sort((a: Event, b: Event) => {
        // First sort by date (descending)
        const dateComparison = new Date(b.date).getTime() - new Date(a.date).getTime();
        if (dateComparison !== 0) return dateComparison;

        // Then sort by start time
        return a.startTime?.localeCompare(b.startTime || '') || 0;
      });

      console.log('Total events after sorting:', sortedEvents.length);
      if (sortedEvents.length > 0) {
        console.log('Event IDs:', sortedEvents.map((e: Event) => e._id));
      }

      setEvents(sortedEvents);
    } catch (error) {
      console.error('Error fetching user events:', error);
      setError('Failed to load your events. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  // Load events on component mount
  useEffect(() => {
    if (userId) {
      fetchUserEvents();
    }
  }, [userId]);

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Format time for display
  const formatTime = (time24: string | null | undefined): string => {
    if (!time24) return '';

    try {
      const [hours, minutes] = time24.split(':').map(Number);
      const period = hours >= 12 ? 'PM' : 'AM';
      const hours12 = hours % 12 || 12;
      return `${hours12}:${minutes.toString().padStart(2, '0')} ${period}`;
    } catch (error) {
      console.error('Error formatting time:', error, 'time24:', time24);
      return 'Invalid time';
    }
  };

  // Format duration for display
  const formatDuration = (minutes: number | null | undefined): string => {
    if (!minutes) return '';
    if (minutes < 60) return `${minutes} minutes`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    if (remainingMinutes === 0) return `${hours} hour${hours > 1 ? 's' : ''}`;
    return `${hours} hour${hours > 1 ? 's' : ''} ${remainingMinutes} minutes`;
  };

  // Handle event deletion using Sanity API
  const handleDeleteEvent = async (eventId: string) => {
    if (!eventId) {
      console.error('Error: No event ID provided for deletion');
      setError('Failed to delete event: Missing event ID');
      return;
    }

    setIsDeleting(eventId);
    console.log('Deleting event with ID:', eventId);

    try {
      // Call the delete API endpoint
      const response = await fetch(`/api/community/events/delete?id=${eventId}&userId=${userId}`, {
        method: 'DELETE',
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });

      // Log the response status
      console.log('Delete API response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Delete API error response:', errorText);
        throw new Error(`Failed to delete event: ${response.status} ${errorText}`);
      }

      const data = await response.json();
      console.log('Delete API response:', data);

      // Update the UI state with the filtered events immediately
      // Use a callback to ensure we're working with the latest state
      setEvents(prevEvents => {
        const filteredEvents = prevEvents.filter(event => event._id !== eventId);
        console.log('Updated UI state, remaining events:', filteredEvents.length);
        return filteredEvents;
      });

      // Wait a moment to allow Sanity to process the deletion
      console.log('Waiting for Sanity to process the deletion...');
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Force a refresh from Sanity to get the latest data
      console.log('Forcing refresh from Sanity...');
      await fetchUserEvents(true); // Pass true to force a refresh

      // Trigger a revalidation of the events API
      try {
        const revalidateResponse = await fetch(`/api/revalidate?tag=events&secret=kingston-anash-secret`);
        const revalidateData = await revalidateResponse.json();
        console.log('Revalidation response:', revalidateData);
      } catch (revalidateError) {
        console.error('Error revalidating events:', revalidateError);
      }
    } catch (error) {
      console.error('Error deleting event:', error);
      setError('Failed to delete event. Please try again later.');
    } finally {
      setIsDeleting(null);
      setShowConfirmDelete(null);
    }
  };

  // Handle event creation using Sanity API
  const handleEventCreated = async (event: Event) => {
    try {
      console.log('Event created:', event);

      // The event has already been created by the EventForm component
      // We need to update the UI immediately and then refresh from Sanity

      // Add the new event to the current state to provide immediate feedback
      setEvents(prevEvents => {
        const newEvents = [...prevEvents, event];
        // Sort events by date (descending) and start time
        return newEvents.sort((a: Event, b: Event) => {
          // First sort by date (descending)
          const dateComparison = new Date(b.date).getTime() - new Date(a.date).getTime();
          if (dateComparison !== 0) return dateComparison;

          // Then sort by start time
          return a.startTime?.localeCompare(b.startTime || '') || 0;
        });
      });

      // Hide the create form
      setShowCreateForm(false);

      // Wait a moment to allow Sanity to process the creation
      console.log('Waiting for Sanity to process the creation...');
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Force a refresh from Sanity to get the latest data
      console.log('Forcing refresh from Sanity...');
      await fetchUserEvents(true); // Pass true to force a refresh

      // Trigger a revalidation of the events API
      try {
        const revalidateResponse = await fetch(`/api/revalidate?tag=events&secret=kingston-anash-secret`);
        const revalidateData = await revalidateResponse.json();
        console.log('Revalidation response:', revalidateData);
      } catch (revalidateError) {
        console.error('Error revalidating events:', revalidateError);
      }
    } catch (error) {
      console.error('Error after creating event:', error);
      setError('Failed to refresh events. Please try again later.');
    }
  };

  // Handle event update using Sanity API
  const handleEventUpdated = async (updatedEvent: Event) => {
    try {
      console.log('Event updated:', updatedEvent);
      console.log('Event ID being updated:', updatedEvent._id);

      if (!updatedEvent._id) {
        console.error('Error: Updated event has no ID');
        setError('Failed to update event: Missing event ID');
        return;
      }

      // The event has already been updated by the EventForm component
      // We need to update the UI immediately and then refresh from Sanity

      // Update the event in the current state to provide immediate feedback to the user
      setEvents(prevEvents => {
        // Create a new array with the updated event
        const updatedEvents = prevEvents.map(event =>
          event._id === updatedEvent._id ? updatedEvent : event
        );
        console.log('Updated events in state:', updatedEvents.length);
        return updatedEvents;
      });

      // Clear the editing state
      setEditingEvent(null);

      // Wait a moment to allow Sanity to process the update
      console.log('Waiting for Sanity to process the update...');
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Force a refresh from Sanity to get the latest data
      console.log('Forcing refresh from Sanity...');
      await fetchUserEvents(true); // Pass true to force a refresh

      // Trigger a revalidation of the events API
      try {
        const revalidateResponse = await fetch(`/api/revalidate?tag=events&secret=kingston-anash-secret`);
        const revalidateData = await revalidateResponse.json();
        console.log('Revalidation response:', revalidateData);
      } catch (revalidateError) {
        console.error('Error revalidating events:', revalidateError);
      }
    } catch (error) {
      console.error('Error updating event:', error);
      setError('Failed to update event. Please try again later.');
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Your Events</h2>

        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="text-sm px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors duration-200 cursor-pointer"
        >
          {showCreateForm ? 'Cancel' : 'Create New Event'}
        </button>
      </div>

      {showCreateForm && (
        <div className="mt-4">
          <EventForm onEventCreated={handleEventCreated} />
        </div>
      )}

      {editingEvent ? (
        <div className="mt-4">
          <h3 className="text-lg font-medium mb-4">Edit Event</h3>
          <EventForm
            onEventCreated={handleEventUpdated}
            initialEvent={editingEvent}
            isEditing={true}
          />
          <button
            onClick={() => setEditingEvent(null)}
            className="mt-4 text-sm px-3 py-1.5 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded transition-colors duration-200 cursor-pointer"
          >
            Cancel Editing
          </button>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          {events.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-500 dark:text-gray-400">You haven't created any events yet.</p>
              <button
                onClick={() => setShowCreateForm(true)}
                className="mt-4 text-sm px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors duration-200 cursor-pointer"
              >
                Create Your First Event
              </button>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {events.map(event => (
                <li key={event._id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-750">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white uppercase tracking-wide">
                        {event.title}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Date: {formatDate(event.date)}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                        Time: {event.startTime}
                      </p>
                      {event.location && (
                        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                          Location: {event.location}
                        </p>
                      )}
                      {event.description && (
                        <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                          {event.description}
                        </p>
                      )}
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                        ID: {event._id}
                      </p>
                    </div>

                    <div className="flex space-x-2">
                      <button
                        onClick={() => setEditingEvent(event)}
                        className="p-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 cursor-pointer"
                        aria-label="Edit event"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>

                      {showConfirmDelete === event._id ? (
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleDeleteEvent(event._id)}
                            disabled={isDeleting === event._id}
                            className={`text-xs px-2 py-1 bg-red-600 text-white rounded cursor-pointer ${
                              isDeleting === event._id ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-700'
                            }`}
                          >
                            {isDeleting === event._id ? 'Deleting...' : 'Confirm'}
                          </button>
                          <button
                            onClick={() => setShowConfirmDelete(null)}
                            className="text-xs px-2 py-1 bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200 rounded hover:bg-gray-300 dark:hover:bg-gray-600 cursor-pointer"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setShowConfirmDelete(event._id)}
                          className="p-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 cursor-pointer"
                          aria-label="Delete event"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default UserEvents;
