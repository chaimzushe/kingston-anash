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

const NewsArticle: React.FC<NewsArticleProps> = ({
  title,
  summary,
  date,
  author,
  imageUrl,
  sourceUrl,
  source
}) => {
  const isExternalLink = !sourceUrl.startsWith('/');

  const CardContent = ({ isWrappedInLink = false }) => (
    <>
      <ArticleImage imageUrl={imageUrl} title={title} />
      <div className="px-4 py-5 sm:p-6">
        <ArticleHeader date={date} source={source} />
        <ArticleContent title={title} summary={summary} />
        <ArticleFooter
          author={author}
          sourceUrl={sourceUrl}
          isExternal={isExternalLink}
          isInsideLink={isWrappedInLink}
        />
      </div>
    </>
  );

  return (
    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-md rounded-lg transition-all duration-300 hover:shadow-lg hover:translate-y-[-4px]">
        <Link href={sourceUrl} className="block h-full cursor-pointer">
          <CardContent isWrappedInLink={false} />
        </Link>
    </div>
  );
};

export default NewsArticle;
