'use client';

import React from 'react';

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  placeholder?: string;
  showCount?: boolean;
  totalCount?: number;
  filteredCount?: number;
}

const SearchBar: React.FC<SearchBarProps> = ({
  searchTerm,
  onSearchChange,
  placeholder = 'Search...',
  showCount = false,
  totalCount = 0,
  filteredCount = 0,
}) => {
  return (
    <div className="relative w-full">
      <div className="absolute left-0 pl-3 flex items-center pointer-events-none" style={{ top: '32%', transform: 'translateY(-50%)' }}>
        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
        </svg>
      </div>
      <input
       
        className="block w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-700 rounded-md leading-5 bg-white dark:bg-gray-800 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-gray-900 dark:text-white text-sm"
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        autoComplete="off"
      />
      {searchTerm && (
        <button
          className="absolute right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500"
          onClick={() => onSearchChange('')}
          aria-label="Clear search"
          style={{ top: '32%', transform: 'translateY(-50%)' }}
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      )}
      {showCount && (
        <div className="text-xs text-center text-gray-500 mt-2">
          Showing {filteredCount} of {totalCount} members
        </div>
      )}
    </div>
  );
};

export default SearchBar;
