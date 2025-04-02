"use client";

import React, { useState } from 'react';
import NewsArticle from './NewsArticle';
import CategoryFilters from './CategoryFilters';
import { NewsArticle as NewsArticleType } from '../../data/newsArticles';

interface NewsSectionProps {
  articles: NewsArticleType[];
}

const NewsSection: React.FC<NewsSectionProps> = ({ articles }) => {
  const [activeCategory, setActiveCategory] = useState('All');

  // Extract unique categories from articles
  const categories = ['All', ...Array.from(new Set(articles.map(article => article.category)))];

  // Filter articles based on active category
  const filteredArticles = activeCategory === 'All'
    ? articles
    : articles.filter(article => article.category === activeCategory);

  return (
    <div id="news" className="mb-16">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-4">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Latest News</h2>
        <CategoryFilters
          categories={categories}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {filteredArticles.map((article) => (
          <NewsArticle
            key={article.id}
            title={article.title}
            summary={article.summary}
            date={article.date}
            author={article.author}
            imageUrl={article.imageUrl}
            sourceUrl={article.sourceUrl}
            source={article.source}
          />
        ))}
      </div>

      <div className="mt-10 text-center">
        <button className="px-6 py-3 bg-gradient-primary hover:opacity-90 text-white font-medium rounded-md shadow-md transition-all duration-200 hover:shadow-lg">
          Load More Articles
        </button>
      </div>
    </div>
  );
};

export default NewsSection;
