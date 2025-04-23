"use client";

import React, { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import {
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  UserIcon,
  CurrencyDollarIcon,
  TruckIcon,
  ArrowPathRoundedSquareIcon
} from '@heroicons/react/24/outline';
import { RideShare } from '@/types/rideShare';

interface RideOfferFormProps {
  initialData?: Partial<RideShare>;
  onSuccess?: () => void;
  isEditing?: boolean;
}

const RideOfferForm: React.FC<RideOfferFormProps> = ({
  initialData = {},
  onSuccess,
  isEditing = false
}) => {
  const { user } = useUser();
  const router = useRouter();

  // Form state
  const [origin, setOrigin] = useState(initialData.origin || 'Kingston');
  const [destination, setDestination] = useState(initialData.destination || '');
  const [departureDate, setDepartureDate] = useState(initialData.departureDate || getTodayDate());
  const [departureTime, setDepartureTime] = useState(initialData.departureTime || '09:00');
  const [isRoundTrip, setIsRoundTrip] = useState(initialData.isRoundTrip || false);
  const [returnDate, setReturnDate] = useState(initialData.returnDate || getTodayDate());
  const [returnTime, setReturnTime] = useState(initialData.returnTime || '18:00');
  const [availableSeats, setAvailableSeats] = useState(initialData.availableSeats || 3);
  const [pricePerSeat, setPricePerSeat] = useState(initialData.pricePerSeat || 20);
  const [vehicleType, setVehicleType] = useState(initialData.vehicleType || '');
  const [notes, setNotes] = useState(initialData.notes || '');
  const [contactPhone, setContactPhone] = useState(initialData.contactPhone || '');

  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Helper function to get today's date in YYYY-MM-DD format
  function getTodayDate() {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      setError('You must be logged in to offer a ride');
      return;
    }

    // Validate form
    if (!origin || !destination || !departureDate || !departureTime || availableSeats < 1) {
      setError('Please fill in all required fields');
      return;
    }

    // Validate round trip data
    if (isRoundTrip && (!returnDate || !returnTime)) {
      setError('Please provide return date and time for round trips');
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');
      setSuccess('');

      // Prepare the data
      const rideData = {
        id: initialData.id || '',
        driverName: user.fullName || 'Anonymous',
        origin,
        destination,
        departureDate,
        departureTime,
        returnDate: isRoundTrip ? returnDate : undefined,
        returnTime: isRoundTrip ? returnTime : undefined,
        availableSeats,
        pricePerSeat,
        contactPhone,
        contactEmail: user.primaryEmailAddress?.emailAddress,
        notes,
        isRoundTrip,
        vehicleType,
        userId: user.id,
        userEmail: user.primaryEmailAddress?.emailAddress || '',
      };

      // Submit to API
      const endpoint = isEditing
        ? '/api/community/rides/update'
        : '/api/community/rides/create';

      const method = isEditing ? 'PUT' : 'POST';

      console.log(`Submitting ride data to ${endpoint}:`, rideData);

      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(rideData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || result.message || 'Failed to save ride offer');
      }

      setSuccess(isEditing ? 'Ride updated successfully!' : 'Ride offered successfully!');

      // Reset form if not editing
      if (!isEditing) {
        setOrigin('Kingston');
        setDestination('');
        setDepartureDate(getTodayDate());
        setDepartureTime('09:00');
        setIsRoundTrip(false);
        setReturnDate(getTodayDate());
        setReturnTime('18:00');
        setAvailableSeats(3);
        setPricePerSeat(20);
        setVehicleType('');
        setNotes('');
        setContactPhone('');
      }

      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess();
      }

      // Redirect to the rides page after a short delay
      setTimeout(() => {
        router.push('/community/ride-share');
      }, 1500);

    } catch (error: any) {
      setError(error.message || 'An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 md:p-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
        {isEditing ? 'Edit Ride Offer' : ''}
      </h2>

      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-lg">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Route Section */}
        <div className="p-5 bg-blue-50 dark:bg-blue-900/10 rounded-lg border border-blue-100 dark:border-blue-900/30">
          <h3 className="text-lg font-semibold mb-4 text-blue-800 dark:text-blue-300 flex items-center">
            <MapPinIcon className="w-5 h-5 mr-2" />
            Route Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Origin */}
            <div>
              <label htmlFor="origin" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Origin *
              </label>
              <input
                type="text"
                id="origin"
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                placeholder="Where are you leaving from?"
                required
              />
            </div>

            {/* Destination */}
            <div>
              <label htmlFor="destination" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Destination *
              </label>
              <input
                type="text"
                id="destination"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                placeholder="Where are you going to?"
                required
              />
            </div>
          </div>
        </div>

        {/* Schedule Section */}
        <div className="p-5 bg-green-50 dark:bg-green-900/10 rounded-lg border border-green-100 dark:border-green-900/30">
          <h3 className="text-lg font-semibold mb-4 text-green-800 dark:text-green-300 flex items-center">
            <CalendarIcon className="w-5 h-5 mr-2" />
            Schedule
          </h3>

          <div className="flex items-center mb-4">
            <label className="inline-flex items-center cursor-pointer">
              <div className="relative">
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={isRoundTrip}
                  onChange={(e) => setIsRoundTrip(e.target.checked)}
                />
                <div className={`block w-14 h-8 rounded-full ${isRoundTrip ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
                <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${isRoundTrip ? 'transform translate-x-6' : ''}`}></div>
              </div>
              <span className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
                <ArrowPathRoundedSquareIcon className="w-4 h-4 mr-1" />
                Round Trip
              </span>
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Departure Date */}
            <div>
              <label htmlFor="departureDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Departure Date *
              </label>
              <input
                type="date"
                id="departureDate"
                value={departureDate}
                onChange={(e) => setDepartureDate(e.target.value)}
                min={getTodayDate()}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                required
              />
            </div>

            {/* Departure Time */}
            <div>
              <label htmlFor="departureTime" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Departure Time *
              </label>
              <input
                type="time"
                id="departureTime"
                value={departureTime}
                onChange={(e) => setDepartureTime(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                required
              />
            </div>

            {/* Return Date - Only shown if round trip */}
            {isRoundTrip && (
              <div>
                <label htmlFor="returnDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Return Date *
                </label>
                <input
                  type="date"
                  id="returnDate"
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  min={departureDate}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                  required={isRoundTrip}
                />
              </div>
            )}

            {/* Return Time - Only shown if round trip */}
            {isRoundTrip && (
              <div>
                <label htmlFor="returnTime" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Return Time *
                </label>
                <input
                  type="time"
                  id="returnTime"
                  value={returnTime}
                  onChange={(e) => setReturnTime(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                  required={isRoundTrip}
                />
              </div>
            )}
          </div>
        </div>

        {/* Ride Details Section */}
        <div className="p-5 bg-purple-50 dark:bg-purple-900/10 rounded-lg border border-purple-100 dark:border-purple-900/30">
          <h3 className="text-lg font-semibold mb-4 text-purple-800 dark:text-purple-300 flex items-center">
            <TruckIcon className="w-5 h-5 mr-2" />
            Ride Details
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Available Seats */}
            <div>
              <label htmlFor="availableSeats" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Available Seats *
              </label>
              <div className="relative">
                <input
                  type="number"
                  id="availableSeats"
                  value={availableSeats}
                  onChange={(e) => setAvailableSeats(parseInt(e.target.value))}
                  min="1"
                  max="10"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                  required
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <UserIcon className="w-5 h-5 text-gray-400" />
                </div>
              </div>
            </div>

            {/* Price Per Seat */}
            <div>
              <label htmlFor="pricePerSeat" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Price Per Seat ($) *
              </label>
              <div className="relative">
                <input
                  type="number"
                  id="pricePerSeat"
                  value={pricePerSeat}
                  onChange={(e) => setPricePerSeat(parseInt(e.target.value))}
                  min="0"
                  step="1"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                  required
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <CurrencyDollarIcon className="w-5 h-5 text-gray-400" />
                </div>
              </div>
            </div>

            {/* Vehicle Type */}
            <div>
              <label htmlFor="vehicleType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Vehicle Type
              </label>
              <select
                id="vehicleType"
                value={vehicleType}
                onChange={(e) => setVehicleType(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
              >
                <option value="">Select Vehicle Type</option>
                <option value="Sedan">Sedan</option>
                <option value="SUV">SUV</option>
                <option value="Minivan">Minivan</option>
                <option value="Van">Van</option>
                <option value="Truck">Truck</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          {/* Notes */}
          <div className="mt-4">
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Additional Notes
            </label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
              placeholder="Any additional information about the ride..."
            />
          </div>
        </div>

        {/* Contact Information */}
        <div className="p-5 bg-amber-50 dark:bg-amber-900/10 rounded-lg border border-amber-100 dark:border-amber-900/30">
          <h3 className="text-lg font-semibold mb-4 text-amber-800 dark:text-amber-300">
            Contact Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-md p-3 bg-white dark:bg-gray-800">
              <div className="flex-shrink-0 mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs text-gray-500 dark:text-gray-400">Your Name</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{user?.fullName || 'Not available'}</p>
              </div>
            </div>

            <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-md p-3 bg-white dark:bg-gray-800">
              <div className="flex-shrink-0 mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs text-gray-500 dark:text-gray-400">Your Email</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{user?.primaryEmailAddress?.emailAddress || 'Not available'}</p>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <label htmlFor="contactPhone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Phone Number (Optional)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
              </div>
              <input
                type="tel"
                id="contactPhone"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                className="w-full pl-10 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                placeholder="Your phone number"
              />
            </div>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Your name and email will be automatically included with your ride offer.
            </p>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-6 py-2 bg-gradient-primary text-white font-medium rounded-md shadow-sm hover:opacity-90 hover:shadow-md transition-all duration-200 ${
              isSubmitting ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'
            }`}
          >
            {isSubmitting ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {isEditing ? 'Updating...' : 'Submitting...'}
              </span>
            ) : (
              <span>{isEditing ? 'Update Ride Offer' : 'Submit Ride Offer'}</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RideOfferForm;
