'use client';

import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center pattern-overlay">
      <div className="text-center p-8 max-w-md">
        <div className="inline-block mb-4 px-6 py-1 bg-gradient-primary rounded-full text-white text-sm font-medium">404</div>
        <h2 className="text-3xl font-bold mb-4">Article Not Found</h2>
        <p className="mb-8 text-gray-600 dark:text-gray-300">
          Sorry, we couldn't find the blog post you were looking for.
        </p>
        <Link 
          href="/blog" 
          className="px-6 py-3 bg-gradient-primary hover:opacity-90 text-white font-medium rounded-md shadow-md transition-all duration-200 hover:shadow-lg inline-block"
        >
          Back to Blog
        </Link>
      </div>
    </div>
  );
}
