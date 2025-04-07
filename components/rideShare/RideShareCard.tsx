"use client";

import React from 'react';
import { 
  MapPinIcon, 
  CalendarIcon, 
  ClockIcon, 
  UserIcon,
  CurrencyDollarIcon,
  ArrowsRightLeftIcon,
  TruckIcon
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
  
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 ${
      isPastRide() ? 'opacity-60' : ''
    }`}>
      <div className="p-4">
        {/* Header with origin and destination */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <MapPinIcon className="w-5 h-5 text-primary" />
            <div>
              <span className="font-medium text-gray-900 dark:text-white">{ride.origin}</span>
              <span className="mx-2 text-gray-400">→</span>
              <span className="font-medium text-gray-900 dark:text-white">{ride.destination}</span>
            </div>
          </div>
          <div className="text-sm font-medium text-primary bg-primary/10 px-2 py-1 rounded">
            {getDaysUntilDeparture()}
          </div>
        </div>
        
        {/* Departure and return info */}
        <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300 mb-4">
          <div className="flex items-center">
            <CalendarIcon className="w-4 h-4 mr-2 text-gray-400" />
            <div>
              <span>Departure: {formatDate(ride.departureDate)} at {formatTime(ride.departureTime)}</span>
              {ride.isRoundTrip && ride.returnDate && ride.returnTime && (
                <div className="mt-1 ml-6">
                  <span>Return: {formatDate(ride.returnDate)} at {formatTime(ride.returnTime)}</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center">
            <UserIcon className="w-4 h-4 mr-2 text-gray-400" />
            <span>{ride.availableSeats} {ride.availableSeats === 1 ? 'seat' : 'seats'} available</span>
          </div>
          
          <div className="flex items-center">
            <CurrencyDollarIcon className="w-4 h-4 mr-2 text-gray-400" />
            <span>${ride.pricePerSeat} per seat</span>
          </div>
          
          {ride.vehicleType && (
            <div className="flex items-center">
              <TruckIcon className="w-4 h-4 mr-2 text-gray-400" />
              <span>{ride.vehicleType}</span>
            </div>
          )}
          
          <div className="flex items-center">
            <ArrowsRightLeftIcon className="w-4 h-4 mr-2 text-gray-400" />
            <span>{ride.isRoundTrip ? 'Round trip' : 'One way'}</span>
          </div>
        </div>
        
        {/* Notes */}
        {ride.notes && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-1">
              Notes
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {ride.notes}
            </p>
          </div>
        )}
        
        {/* Driver and contact info */}
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
            Driver: {ride.driverName}
          </h4>
          <div className="flex flex-wrap gap-2">
            {ride.contactEmail && (
              <a 
                href={`mailto:${ride.contactEmail}`}
                className="inline-flex items-center px-3 py-1 rounded text-sm font-medium bg-primary text-white hover:bg-primary/90 transition-colors"
              >
                Email
              </a>
            )}
            {ride.contactPhone && (
              <a 
                href={`tel:${ride.contactPhone.replace(/[^0-9]/g, '')}`}
                className="inline-flex items-center px-3 py-1 rounded text-sm font-medium bg-primary text-white hover:bg-primary/90 transition-colors"
              >
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
