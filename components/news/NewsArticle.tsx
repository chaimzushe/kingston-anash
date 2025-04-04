"use client";

import React from 'react';
import Link from 'next/link';
import ArticleImage from './ArticleImage';
import ArticleHeader from './ArticleHeader';
import ArticleContent from './ArticleContent';
import ArticleFooter from './ArticleFooter';

interface NewsArticleProps {
  title: string;
  summary: string;
  date: string;
  author: string;
  imageUrl: string;
  sourceUrl: string;
  source: string;
}

const NewsArticle: React.FC<any> = ({
  title,
  summary,
  date,
  author,
  imageUrl,
  sourceUrl,
  source
}) => {
  const isExternalLink = !sourceUrl.startsWith('/');

  const CardContent = () => (
    <div className="flex flex-col h-full">
      <ArticleImage imageUrl={imageUrl} title={title} />
      <div className="px-4 py-5 sm:p-6 flex-grow flex flex-col">
        <div>
          <ArticleHeader date={date} source={source} />
          <ArticleContent title={title} summary={summary} />
        </div>
        <div className="mt-auto pt-4">
          <ArticleFooter
            author={author}
            sourceUrl={sourceUrl}
            isExternal={isExternalLink}
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-md rounded-lg transition-all duration-300 hover:shadow-lg hover:translate-y-[-4px] flex flex-col h-full">
        <Link href={sourceUrl} className="block h-full cursor-pointer">
          <CardContent />
        </Link>
    </div>
  );
};

export default NewsArticle;
