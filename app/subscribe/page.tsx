import React from 'react';
import Link from 'next/link';
import { sanityClient } from '@/lib/sanity';
import SubscriptionFormWrapper from '@/components/subscription/SubscriptionFormWrapper';
import PushNotificationWrapper from '@/components/subscription/PushNotificationWrapper';
import { PageHeader } from '@/components/layout';

// Fetch all categories from Sanity
async function getCategories() {
  try {
    // Add a timeout to prevent hanging if Sanity is unreachable
    const fetchWithTimeout = async () => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

      try {
        const categories = await sanityClient.fetch(
          `*[_type == "category"] | order(title asc) {
            _id,
            title
          }`
        );
        clearTimeout(timeoutId);
        return categories;
      } catch (err) {
        clearTimeout(timeoutId);
        throw err;
      }
    };

    const categories = await fetchWithTimeout();
    console.log(`Fetched ${categories.length} categories from Sanity`);
    return categories;
  } catch (error) {
    console.error('Error fetching categories:', error);
    // Return an empty array with a clear error message for debugging
    console.log('Check if your Sanity project has categories and if the connection is working');
    return [];
  }
}

export const metadata = {
  title: 'Subscribe to Updates | Kingston Anash',
  description: 'Subscribe to receive notifications about new posts in your favorite categories.',
};

export default async function SubscribePage() {
  const categories = await getCategories();

  return (
    <div className="min-h-screen py-6 px-4 sm:py-8 sm:px-6 lg:px-8 font-[family-name:var(--font-geist-sans)] pattern-overlay">
      <div className="max-w-3xl mx-auto">
        {/* Back button */}
        <Link
          href="/"
          className="inline-flex items-center text-primary hover:text-secondary transition-colors duration-150 mb-4 sm:mb-8"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          Back to Home
        </Link>

        <PageHeader
          title="Stay Updated"
          subtitle="Subscribe to receive notifications about new posts in your favorite categories"
        />

        <div className="mt-8 space-y-8">
          <SubscriptionFormWrapper categories={categories} />
          <PushNotificationWrapper categories={categories} />
        </div>
      </div>
    </div>
  );
}
