"use client";

import React from 'react';
import {
  CalendarIcon,
  UserIcon,
  CurrencyDollarIcon,
  TruckIcon,
  PhoneIcon,
  EnvelopeIcon,
  ArrowLongRightIcon,
  ArrowPathRoundedSquareIcon
} from '@heroicons/react/24/outline';
import { RideShare } from '@/types/rideShare';

interface RideShareCardProps {
  ride: RideShare;
}

const RideShareCard: React.FC<RideShareCardProps> = ({ ride }) => {
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
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

  // Check if ride is in the past
  const isPastRide = () => {
    const today = new Date().toISOString().split('T')[0];
    return ride.departureDate < today;
  };

  // Calculate days until departure
  const getDaysUntilDeparture = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const departure = new Date(ride.departureDate);
    departure.setHours(0, 0, 0, 0);

    const diffTime = departure.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays < 0) return `${Math.abs(diffDays)} days ago`;
    return `In ${diffDays} days`;
  };

  // Get status color based on days until departure
  const getStatusColor = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const departure = new Date(ride.departureDate);
    departure.setHours(0, 0, 0, 0);

    const diffTime = departure.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return 'bg-gray-200 text-gray-700'; // Past
    if (diffDays === 0) return 'bg-orange-100 text-orange-700'; // Today
    if (diffDays === 1) return 'bg-yellow-100 text-yellow-700'; // Tomorrow
    if (diffDays <= 3) return 'bg-blue-100 text-blue-700'; // Soon
    return 'bg-green-100 text-green-700'; // Future
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${
      isPastRide() ? 'opacity-70' : ''
    }`}>
      {/* Card Header - Origin/Destination with Gradient Background */}
      <div className="bg-gradient-to-r from-primary/90 to-primary text-white p-4 relative">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold flex items-center">
            <span>{ride.origin}</span>
            <ArrowLongRightIcon className="w-5 h-5 mx-2" />
            <span>{ride.destination}</span>
          </h3>
          <div className={`${getStatusColor()} px-3 py-1 rounded-full text-xs font-semibold`}>
            {getDaysUntilDeparture()}
          </div>
        </div>

        {/* Trip Type Badge */}
        <div className="absolute -bottom-3 left-4">
          <div className="flex items-center bg-white dark:bg-gray-700 text-primary dark:text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
            {ride.isRoundTrip ? (
              <>
                <ArrowPathRoundedSquareIcon className="w-3 h-3 mr-1" />
                ROUND TRIP
              </>
            ) : (
              <>
                <ArrowLongRightIcon className="w-3 h-3 mr-1" />
                ONE WAY
              </>
            )}
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5">
        {/* Departure and Return Info */}
        <div className="mb-5 bg-gray-50 dark:bg-gray-700/30 rounded-lg p-3">
          <div className="flex items-start mb-2">
            <div className="bg-primary/10 p-2 rounded-full mr-3">
              <CalendarIcon className="w-5 h-5 text-primary" />
            </div>
            <div>
              <div className="font-medium text-gray-900 dark:text-white">
                {formatDate(ride.departureDate)} at {formatTime(ride.departureTime)}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Departure</div>
            </div>
          </div>

          {ride.isRoundTrip && ride.returnDate && ride.returnTime && (
            <div className="flex items-start pl-10">
              <div>
                <div className="font-medium text-gray-900 dark:text-white">
                  {formatDate(ride.returnDate)} at {formatTime(ride.returnTime)}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Return</div>
              </div>
            </div>
          )}
        </div>

        {/* Ride Details */}
        <div className="grid grid-cols-2 gap-4 mb-5">
          <div className="flex items-center">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded-full mr-3">
              <UserIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <div className="font-medium text-gray-900 dark:text-white">
                {ride.availableSeats}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {ride.availableSeats === 1 ? 'Seat' : 'Seats'}
              </div>
            </div>
          </div>

          <div className="flex items-center">
            <div className="bg-green-50 dark:bg-green-900/20 p-2 rounded-full mr-3">
              <CurrencyDollarIcon className="w-4 h-4 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <div className="font-medium text-gray-900 dark:text-white">
                ${ride.pricePerSeat}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Per seat</div>
            </div>
          </div>

          {ride.vehicleType && (
            <div className="flex items-center">
              <div className="bg-purple-50 dark:bg-purple-900/20 p-2 rounded-full mr-3">
                <TruckIcon className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <div className="font-medium text-gray-900 dark:text-white">
                  {ride.vehicleType}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Vehicle</div>
              </div>
            </div>
          )}
        </div>

        {/* Notes */}
        {ride.notes && (
          <div className="mb-5 bg-yellow-50 dark:bg-yellow-900/10 p-3 rounded-lg border-l-4 border-yellow-400">
            <h4 className="text-sm font-bold text-yellow-800 dark:text-yellow-200 mb-1">
              Notes
            </h4>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              {ride.notes}
            </p>
          </div>
        )}

        {/* Driver and Contact Info */}
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center mb-3">
            <h4 className="font-bold text-gray-900 dark:text-white flex items-center">
              <span className="bg-gray-100 dark:bg-gray-700 p-1 rounded-full mr-2">
                <UserIcon className="w-4 h-4 text-gray-600 dark:text-gray-300" />
              </span>
              {ride.driverName}
            </h4>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Posted {new Date(ride.postedDate).toLocaleDateString()}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {ride.contactEmail && (
              <a
                href={`mailto:${ride.contactEmail}`}
                className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-primary text-white hover:bg-primary-dark transition-colors shadow-sm hover:shadow-md"
              >
                <EnvelopeIcon className="w-4 h-4 mr-2" />
                Email
              </a>
            )}
            {ride.contactPhone && (
              <a
                href={`tel:${ride.contactPhone.replace(/[^0-9]/g, '')}`}
                className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-green-600 text-white hover:bg-green-700 transition-colors shadow-sm hover:shadow-md"
              >
                <PhoneIcon className="w-4 h-4 mr-2" />
                Call
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RideShareCard;
