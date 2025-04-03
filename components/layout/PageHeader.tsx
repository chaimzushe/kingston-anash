"use client";

import React from 'react';

interface PageHeaderProps {
  title: string;
  subtitle: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle }) => {
  return (
    <div className="text-center my-12">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
        {title}
      </h1>
      <div className="w-24 h-1 bg-accent mx-auto my-6 rounded-full"></div>
      <p className="mt-3 max-w-md mx-auto text-base text-gray-600 dark:text-gray-300 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
        {subtitle}
      </p>
    </div>
  );
};

export default PageHeader;
