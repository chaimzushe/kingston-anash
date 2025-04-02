import React from 'react';
import { notFound } from 'next/navigation';
import { blogArticles } from '../../../data/blogArticles';
import BlogDetail from '../../../components/blog/BlogDetail';

export async function generateStaticParams() {
  return blogArticles.map((article) => ({
    id: article.id,
  }));
}

export async function generateMetadata({ params }: { params: { id: string } }) {
  const article = blogArticles.find((article) => article.id === params.id);

  if (!article) {
    return {
      title: 'Article Not Found',
      description: 'The requested article could not be found.',
    };
  }

  return {
    title: `${article.title} | Kingston Anash`,
    description: article.summary,
  };
}

export default function BlogPostPage({ params }: { params: { id: string } }) {
  const article = blogArticles.find((article) => article.id === params.id);

  if (!article) {
    notFound();
  }

  return <BlogDetail article={article} />;
}
