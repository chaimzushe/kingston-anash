"use client";

import React from 'react';

interface ArticleContentProps {
  title: string;
  summary: string;
}

const ArticleContent: React.FC<ArticleContentProps> = ({ title, summary }) => {
  return (
    <>
      <h3 className="text-xl leading-6 font-medium text-gray-900 dark:text-white mb-2">{title}</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{summary}</p>
    </>
  );
};

export default ArticleContent;
