"use client";

import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { Event } from '@/types/events';

interface EventFormProps {
  onEventCreated: (event: Event) => void;
  initialEvent?: Event;
  isEditing?: boolean;
}

const EventForm: React.FC<EventFormProps> = ({ onEventCreated, initialEvent, isEditing = false }) => {
  const { user, isLoaded } = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Form state
  const [title, setTitle] = useState(initialEvent?.title || '');
  const [description, setDescription] = useState(initialEvent?.description || '');
  const [date, setDate] = useState(initialEvent?.date ? initialEvent.date.split('T')[0] : '');
  const [startTime, setStartTime] = useState(initialEvent?.startTime || '09:00');
  const [duration, setDuration] = useState(initialEvent?.duration ? initialEvent.duration.toString() : '');
  const [location, setLocation] = useState(initialEvent?.location || '');
  const [gender, setGender] = useState(initialEvent?.gender || 'both');
  const [eventId, setEventId] = useState(initialEvent?._id || '');

  // Generate time options in 30-minute increments
  const timeOptions = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const formattedHour = hour.toString().padStart(2, '0');
      const formattedMinute = minute.toString().padStart(2, '0');
      const timeValue = `${formattedHour}:${formattedMinute}`;
      const displayTime = formatTimeForDisplay(timeValue);
      timeOptions.push({ value: timeValue, label: displayTime });
    }
  }

  // Duration options
  const durationOptions = [
    { value: '15', label: '15 minutes' },
    { value: '30', label: '30 minutes' },
    { value: '45', label: '45 minutes' },
    { value: '60', label: '1 hour' },
    { value: '90', label: '1.5 hours' },
    { value: '120', label: '2 hours' },
    { value: '150', label: '2.5 hours' },
    { value: '180', label: '3 hours' },
    { value: '210', label: '3.5 hours' },
    { value: '240', label: '4 hours' },
  ];

  // Helper function to format time for display
  function formatTimeForDisplay(time24: string | null | undefined): string {
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
  }

  // Calculate end time based on start time and duration
  function calculateEndTime(startTime: string | null | undefined, durationMinutes: number): string | null {
    if (!startTime || !durationMinutes) return null;

    try {
      const [hours, minutes] = startTime.split(':').map(Number);
      const startDate = new Date();
      startDate.setHours(hours, minutes, 0, 0);

      const endDate = new Date(startDate.getTime() + durationMinutes * 60000);
      const endHours = endDate.getHours().toString().padStart(2, '0');
      const endMinutes = endDate.getMinutes().toString().padStart(2, '0');

      return `${endHours}:${endMinutes}`;
    } catch (error) {
      console.error('Error calculating end time:', error, 'startTime:', startTime, 'durationMinutes:', durationMinutes);
      return null;
    }
  }

  // Get today's date in YYYY-MM-DD format for min date attribute
  const today = new Date().toISOString().split('T')[0];

  // Update form values when initialEvent changes
  useEffect(() => {
    if (initialEvent) {
      setTitle(initialEvent.title || '');
      setDescription(initialEvent.description || '');
      setDate(initialEvent.date ? initialEvent.date.split('T')[0] : '');
      setStartTime(initialEvent.startTime || '09:00');
      setDuration(initialEvent.duration ? initialEvent.duration.toString() : '');
      setLocation(initialEvent.location || '');
      setGender(initialEvent.gender || 'both');
      setEventId(initialEvent._id || '');
    }
  }, [initialEvent]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      // Always use client-side APIs that don't rely on server-side authentication
      // We'll handle all events as mock events to avoid Sanity authentication issues
      const endpoint = isEditing ? '/api/community/events/update-client' : '/api/community/events/create-client';
      const method = isEditing ? 'PATCH' : 'POST';

      const eventData: any = {
        title,
        description,
        date,
        startTime,
        endTime: duration ? calculateEndTime(startTime, parseInt(duration)) : null,
        duration: duration ? parseInt(duration) : null,
        location,
        gender,
        creator: {
          id: user?.id || 'anonymous',
          name: user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.username || 'Anonymous' : 'Anonymous',
          email: user?.emailAddresses[0]?.emailAddress || 'anonymous@example.com'
        },
      };

      // If editing, add the event ID and user ID
      if (isEditing && eventId) {
        eventData.eventId = eventId;
        eventData.userId = user?.id; // Add user ID for permission check
      }

      console.log(`Submitting event to ${endpoint} with method ${method}:`, eventData);

      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData),
      });

      console.log(`Response status from ${endpoint}:`, response.status);

      // Check if response is ok before trying to parse JSON
      if (!response.ok) {
        // For non-JSON responses, use the status text
        if (!response.headers.get('content-type')?.includes('application/json')) {
          const errorText = await response.text();
          console.error(`Error response from ${endpoint}:`, errorText);
          throw new Error(`Server error: ${response.status} ${response.statusText} - ${errorText}`);
        }
      }

      // Try to parse the JSON response
      let data;
      try {
        data = await response.json();
      } catch (e) {
        console.error('Error parsing JSON response:', e);
        throw new Error('Invalid response from server. Please try again later.');
      }

      if (!response.ok) {
        // Handle specific error cases
        if (response.status === 401) {
          throw new Error('You must be signed in to create events.');
        } else {
          console.error(`Error response data from ${endpoint}:`, data);
          throw new Error(data.message || `Failed to ${isEditing ? 'update' : 'create'} event`);
        }
      }

      // Reset form if not editing
      if (!isEditing) {
        setTitle('');
        setDescription('');
        setDate('');
        setStartTime('09:00');
        setDuration('');
        setLocation('');
        setGender('both');
      }

      // Show success message
      setSuccess(true);

      // Notify parent component with the created/updated event
      // For updates, make sure we preserve the original event ID
      let finalEvent;

      if (isEditing) {
        // For editing, ensure we preserve the original event ID
        finalEvent = {
          ...data.event,
          _id: eventId // Use the original event ID
        };
        console.log('Editing event - using original ID:', eventId);
      } else {
        // For new events, use the ID from the response
        finalEvent = {
          ...data.event
        };
        console.log('Creating new event with ID:', finalEvent._id);
      }

      console.log('Final event being sent to parent:', finalEvent);
      onEventCreated(finalEvent);

      // Hide success message after 3 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isLoaded) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
        {isEditing ? 'Edit Event' : 'Create New Event'}
      </h2>

      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 text-red-700 dark:text-red-300">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 text-green-700 dark:text-green-300">
          {isEditing ? 'Event updated successfully!' : 'Event created successfully!'}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Event Title *
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
            placeholder="Enter event title"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Date *
            </label>
            <input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              min={today}
              required
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Location *
            </label>
            <input
              id="location"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
              placeholder="Enter location"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Start Time *
            </label>
            <select
              id="startTime"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
            >
              {timeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="duration" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Duration (optional)
            </label>
            <select
              id="duration"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
            >
              <option value="">Select duration (optional)</option>
              {durationOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Who can attend? *
          </label>
          <div className="flex space-x-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="gender"
                value="men"
                checked={gender === 'men'}
                onChange={() => setGender('men')}
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
              />
              <span className="ml-2 text-gray-700 dark:text-gray-300">Men Only</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="gender"
                value="women"
                checked={gender === 'women'}
                onChange={() => setGender('women')}
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
              />
              <span className="ml-2 text-gray-700 dark:text-gray-300">Women Only</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="gender"
                value="both"
                checked={gender === 'both'}
                onChange={() => setGender('both')}
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
              />
              <span className="ml-2 text-gray-700 dark:text-gray-300">Everyone</span>
            </label>
          </div>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Description (Optional)
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
            placeholder="Enter event description"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-6 py-2 bg-gradient-primary text-white font-medium rounded-md shadow-sm transition-all duration-200 hover:opacity-90 hover:shadow-md cursor-pointer ${
              isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting
              ? (isEditing ? 'Saving...' : 'Creating...')
              : (isEditing ? 'Save Changes' : 'Create Event')
            }
          </button>
        </div>
      </form>
    </div>
  );
};

export default EventForm;
