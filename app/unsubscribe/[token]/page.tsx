import React from 'react';
import Link from 'next/link';
import { sanityClient, sanityWriteClient } from '@/lib/sanity';
import { PageHeader } from '@/components/layout';

// Unsubscribe a user based on their token
async function unsubscribeUser(token: string) {
  try {
    // Find the subscription with the given token
    // Use a different variable name in the query to avoid type issues
    const query = `*[_type == "subscription" && confirmationToken == $tokenParam && status == "active"][0]`;
    const subscription = await sanityClient.fetch(query, { tokenParam: token });

    if (!subscription) {
      return {
        success: false,
        message: 'Invalid or expired unsubscribe link',
      };
    }

    // Update the subscription status to unsubscribed
    await sanityWriteClient
      .patch(subscription._id)
      .set({
        status: 'unsubscribed',
        updatedAt: new Date().toISOString(),
      })
      .commit();

    return {
      success: true,
      message: 'You have been successfully unsubscribed',
      email: subscription.email,
    };
  } catch (error) {
    console.error('Error unsubscribing:', error);
    return {
      success: false,
      message: 'An error occurred while processing your request',
    };
  }
}

export default async function UnsubscribePage({ params }: any) {
  const { token } = params;
  const result = await unsubscribeUser(token);

  return (
    <div className="min-h-screen py-6 px-4 sm:py-8 sm:px-6 lg:px-8 font-[family-name:var(--font-geist-sans)] pattern-overlay">
      <div className="max-w-3xl mx-auto">
        <PageHeader
          title="Unsubscribe"
          subtitle={result.success ? `You have been unsubscribed from notifications` : 'Unsubscribe from notifications'}
        />

        <div className="mt-8 bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
          {result.success ? (
            <div className="space-y-6">
              <div className="bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 p-4">
                <p className="text-green-700 dark:text-green-300">
                  {result.message}
                </p>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                The email address <span className="font-medium">{result.email}</span> has been removed from our notification list.
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                If you change your mind, you can always subscribe again.
              </p>
              <div className="pt-4">
                <Link
                  href="/subscribe"
                  className="inline-block px-4 py-2 bg-gradient-primary text-white font-medium rounded-md shadow-sm transition-all duration-200 hover:opacity-90 hover:shadow-md"
                >
                  Subscribe Again
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4">
                <p className="text-red-700 dark:text-red-300">
                  {result.message}
                </p>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                The unsubscribe link you used appears to be invalid or has expired.
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                If you're still receiving notifications and wish to unsubscribe, please use the unsubscribe link in the most recent notification email.
              </p>
              <div className="pt-4">
                <Link
                  href="/"
                  className="inline-block px-4 py-2 bg-gradient-primary text-white font-medium rounded-md shadow-sm transition-all duration-200 hover:opacity-90 hover:shadow-md"
                >
                  Return to Home
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
