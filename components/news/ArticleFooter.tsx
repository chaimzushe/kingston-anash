"use client";

import React from 'react';
import Link from 'next/link';

interface ArticleFooterProps {
  author: string;
  sourceUrl: string;
  isExternal?: boolean;
}

const ArticleFooter: React.FC<ArticleFooterProps> = ({ author, sourceUrl, isExternal = false }) => {
  // This prevents click events from bubbling up when clicking the "Read more" link
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const linkClasses = "text-sm font-medium text-primary hover:text-secondary transition-colors duration-150";

  return (
    <div className="flex justify-between items-center">
      <span className="text-xs text-gray-500 dark:text-gray-400">By {author}</span>
      <div onClick={handleClick}>
       
          <Link
            href={sourceUrl}
            className={linkClasses}
            onClick={handleClick}
          >
            Read more →
          </Link>
        
      </div>
    </div>
  );
};

export default ArticleFooter;
