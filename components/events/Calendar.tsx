"use client";

import React, { useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

interface CalendarProps {
  onDateSelect: (date: Date) => void;
  selectedDate: Date;
  events: { date: Date }[];
}

const Calendar: React.FC<CalendarProps> = ({ onDateSelect, selectedDate, events }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date(selectedDate));

  // Get days in month
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  // Get day of week for first day of month (0 = Sunday, 1 = Monday, etc.)
  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  // Navigate to previous month
  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  // Navigate to next month
  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  // Format date as YYYY-MM-DD for comparison
  const formatDateForComparison = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  // Check if a date has events
  const hasEvents = (date: Date) => {
    const dateStr = formatDateForComparison(date);
    return events.some(event => formatDateForComparison(new Date(event.date)) === dateStr);
  };

  // Check if a date is today
  const isToday = (date: Date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  };

  // Check if a date is selected
  const isSelected = (date: Date) => {
    return date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear();
  };

  // Generate calendar days
  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDayOfMonth = getFirstDayOfMonth(currentMonth);
    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="h-10 sm:h-12"></div>);
    }

    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      const hasEventsToday = hasEvents(date);
      const isTodayDate = isToday(date);
      const isSelectedDate = isSelected(date);

      days.push(
        <button
          key={day}
          onClick={() => onDateSelect(date)}
          className={`h-12 sm:h-14 md:h-16 w-full flex items-center justify-center relative rounded-md transition-all duration-200 ${
            isSelectedDate
              ? 'bg-primary text-white font-medium'
              : isTodayDate
                ? 'bg-amber-100 dark:bg-amber-900/30 font-medium'
                : 'hover:bg-gray-100 dark:hover:bg-gray-800'
          }`}
        >
          <span className="text-lg">{day}</span>
          {hasEventsToday && (
            <span className={`absolute bottom-2 w-2 h-2 rounded-full ${
              isSelectedDate ? 'bg-white' : 'bg-primary'
            }`}></span>
          )}
        </button>
      );
    }

    return days;
  };

  // Get month name
  const monthName = currentMonth.toLocaleString('default', { month: 'long' });

  // Get day names
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      {/* Calendar header */}
      <div className="px-5 py-4 flex items-center justify-between bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          {monthName} {currentMonth.getFullYear()}
        </h2>
        <div className="flex space-x-2">
          <button
            onClick={prevMonth}
            className="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            <ChevronLeftIcon className="w-5 h-5" />
          </button>
          <button
            onClick={nextMonth}
            className="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            <ChevronRightIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Calendar grid */}
      <div className="p-5">
        {/* Day names */}
        <div className="grid grid-cols-7 gap-2 mb-3">
          {dayNames.map(day => (
            <div key={day} className="text-center text-sm font-medium text-gray-500 dark:text-gray-400">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar days */}
        <div className="grid grid-cols-7 gap-2">
          {generateCalendarDays()}
        </div>
      </div>
    </div>
  );
};

export default Calendar;
