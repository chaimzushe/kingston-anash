import React from 'react';
import Image from 'next/image';

interface NewsArticleProps {
  title: string;
  summary: string;
  date: string;
  author: string;
  imageUrl: string;
  sourceUrl: string;
  source: string;
}

const NewsArticle: React.FC<NewsArticleProps> = ({
  title,
  summary,
  date,
  author,
  imageUrl,
  sourceUrl,
  source
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg transition-all hover:shadow-lg">
      <div className="relative h-48 w-full">
        <Image 
          src={imageUrl} 
          alt={title}
          fill
          style={{ objectFit: 'cover' }}
          className="transition-transform hover:scale-105"
        />
      </div>
      <div className="px-4 py-5 sm:p-6">
        <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400 mb-2">
          <span>{date}</span>
          <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full text-xs">
            {source}
          </span>
        </div>
        <h3 className="text-xl leading-6 font-medium text-gray-900 dark:text-white mb-2">{title}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{summary}</p>
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-500 dark:text-gray-400">By {author}</span>
          <a 
            href={sourceUrl} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500"
          >
            Read more →
          </a>
        </div>
      </div>
    </div>
  );
};

export default NewsArticle;
