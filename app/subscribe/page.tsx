import React from 'react';
import Link from 'next/link';
import { sanityClient } from '@/lib/sanity';
import SubscriptionForm from '@/components/subscription/SubscriptionForm';
import PushNotificationForm from '@/components/subscription/PushNotificationForm';
import { PageHeader } from '@/components/layout';

// Fetch all categories from Sanity
async function getCategories() {
  try {
    const categories = await sanityClient.fetch(
      `*[_type == "category"] | order(title asc) {
        _id,
        title
      }`
    );
    return categories;
  } catch (error) {
    console.error('Error fetching categories:', error);
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
          <SubscriptionForm categories={categories} />

          <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
            <PushNotificationForm categories={categories} />
          </div>
        </div>
      </div>
    </div>
  );
}
