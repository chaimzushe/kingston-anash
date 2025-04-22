"use client";

import React from 'react';

interface FallbackImageProps {
  title?: string;
  className?: string;
}

const FallbackImage: React.FC<FallbackImageProps> = ({ title, className = "h-full w-full" }) => {
  return (
    <div className={`${className} bg-gray-100 dark:bg-gray-700 flex flex-col items-center justify-center`}>
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className="h-12 w-12 text-gray-400 mb-2" 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={1.5} 
          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
        />
      </svg>
      {title && (
        <p className="text-xs text-gray-500 dark:text-gray-400 text-center px-2">
          {title.length > 30 ? `${title.substring(0, 30)}...` : title}
        </p>
      )}
    </div>
  );
};

export default FallbackImage;
