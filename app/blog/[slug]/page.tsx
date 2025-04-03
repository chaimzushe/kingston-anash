import React from 'react';
import { getPostBySlug, getAllPostSlugs } from '../../../lib/api';
import { notFound } from 'next/navigation';
import BlogDetail from '../../../components/blog/BlogDetail';

// Generate static params for all blog posts
export async function generateStaticParams() {
  try {
    const posts = await getAllPostSlugs();

    return posts.map((post) => ({
      slug: post.slug,
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

export default async function BlogPostPage({ params }: any ) {
  try {
    const post = await getPostBySlug(params.slug);

    if (!post) {
      notFound();
    }

    return <BlogDetail post={post} />;
  } catch (error) {
    console.error(`Error rendering blog post page for slug ${params.slug}:`, error);
    notFound();
  }
}
