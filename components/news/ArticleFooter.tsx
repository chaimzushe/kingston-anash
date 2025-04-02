"use client";

import React from 'react';
import Link from 'next/link';

interface ArticleFooterProps {
  author: string;
  sourceUrl: string;
  isExternal?: boolean;
  isInsideLink?: boolean;
}

const ArticleFooter: React.FC<ArticleFooterProps> = ({ author, sourceUrl, isExternal = false, isInsideLink = false }) => {
  // This prevents click events from bubbling up when clicking the "Read more" link
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };
  return (
    <div className="flex justify-between items-center">
      <span className="text-xs text-gray-500 dark:text-gray-400">By {author}</span>
      {isInsideLink ? (
        <button
          className="text-sm font-medium text-primary hover:text-secondary transition-colors duration-150"
          onClick={(e) => {
            e.stopPropagation();
            window.open(sourceUrl, '_blank', 'noopener,noreferrer');
          }}
        >
          Read more →
        </button>
      ) : isExternal ? (
        <a
          href={sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-medium text-primary hover:text-secondary transition-colors duration-150"
          onClick={handleClick}
        >
          Read more →
        </a>
      ) : (
        <Link
          href={sourceUrl}
          className="text-sm font-medium text-primary hover:text-secondary transition-colors duration-150"
          onClick={handleClick}
        >
          Read more →
        </Link>
      )}
    </div>
  );
};

export default ArticleFooter;
