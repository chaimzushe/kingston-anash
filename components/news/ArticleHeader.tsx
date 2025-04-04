"use client";

import React from 'react';

interface ArticleHeaderProps {
  date: string;
  source: string;
}

const ArticleHeader: React.FC<any> = ({ date, source }) => {
  return (
    <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400 mb-2">
      <span>{date}</span>
      <span className="bg-accent/20 dark:bg-accent/30 text-accent-700 dark:text-accent-200 px-2 py-1 rounded-full text-xs font-medium">
        {source}
      </span>
    </div>
  );
};

export default ArticleHeader;
