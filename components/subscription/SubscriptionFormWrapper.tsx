'use client';

import React from 'react';
import SubscriptionForm from './SubscriptionForm';

interface SubscriptionFormWrapperProps {
  categories: any[];
}

const SubscriptionFormWrapper: React.FC<SubscriptionFormWrapperProps> = ({ categories }) => {
  // Check if we're in the browser environment
  const [isBrowser, setIsBrowser] = React.useState(false);

  React.useEffect(() => {
    setIsBrowser(true);
  }, []);

  // Only render the form on the client side
  if (!isBrowser) {
    return (
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Subscribe to Updates
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Loading subscription form...
        </p>
      </div>
    );
  }

  return <SubscriptionForm categories={categories} />;
};

export default SubscriptionFormWrapper;
