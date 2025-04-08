'use client';

import React from 'react';
import dynamic from 'next/dynamic';

// Dynamically import PushNotificationForm with SSR disabled
const PushNotificationForm = dynamic(
  () => import('./PushNotificationForm'),
  { ssr: false }
);

interface PushNotificationWrapperProps {
  categories: any[];
}

const PushNotificationWrapper: React.FC<PushNotificationWrapperProps> = ({ categories }) => {
  // Check if we're in the browser environment
  const [isBrowser, setIsBrowser] = React.useState(false);

  React.useEffect(() => {
    setIsBrowser(true);
  }, []);

  // Only render the form on the client side
  if (!isBrowser) {
    return (
      <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Push Notifications
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Loading notification options...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
      <PushNotificationForm categories={categories} />
    </div>
  );
};

export default PushNotificationWrapper;
