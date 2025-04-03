'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { urlFor } from '../../lib/sanity';
import { format } from 'date-fns';



const BlogCard: React.FC<any> = ({ post }) => {
  // Format the date
  const formattedDate = post.publishedAt 
    ? format(new Date(post.publishedAt), 'MMMM dd, yyyy')
    : '';

  // Get the first category if available
  const category = post.categories && post.categories.length > 0 
    ? post.categories[0].title 
    : '';

  return (
    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-md rounded-lg transition-all duration-300 hover:shadow-lg hover:translate-y-[-4px]">
      <Link href={`/blog/${post.slug.current}`} className="block h-full">
        <div className="relative h-48 w-full">
          {post.mainImage && (
            <Image
              src={urlFor(post.mainImage).width(600).height(400).url()}
              alt={post.title}
              fill
              style={{ objectFit: 'cover' }}
              className="transition-transform duration-500 hover:scale-110"
            />
          )}
        </div>
        <div className="px-4 py-5 sm:p-6">
          <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400 mb-2">
            <span>{formattedDate}</span>
            {category && (
              <span className="bg-accent/20 dark:bg-accent/30 text-accent-700 dark:text-accent-200 px-2 py-1 rounded-full text-xs font-medium">
                {category}
              </span>
            )}
          </div>
          <h3 className="text-xl leading-6 font-medium text-gray-900 dark:text-white mb-2">{post.title}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{post.summary}</p>
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {post.author ? `By ${post.author.name}` : ''}
            </span>
            <span className="text-sm font-medium text-primary hover:text-secondary transition-colors duration-150">
              Read more →
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default BlogCard;
