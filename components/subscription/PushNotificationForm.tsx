"use client";

import React, { useState, useEffect } from 'react';

interface Category {
  _id: string;
  title: string;
}

interface PushNotificationFormProps {
  categories: Category[];
}

const PushNotificationForm: React.FC<PushNotificationFormProps> = ({ categories }) => {
  const [isSubscribed, setIsSubscribed] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [permission, setPermission] = useState<NotificationPermission | null>(null);

  // Check if the browser supports push notifications
  const isPushSupported = () => {
    return 'serviceWorker' in navigator && 'PushManager' in window;
  };

  // Check the current subscription status
  useEffect(() => {
    const checkSubscription = async () => {
      if (!isPushSupported()) {
        setError('Push notifications are not supported in your browser');
        return;
      }

      try {
        setPermission(Notification.permission);

        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.getSubscription();

        setIsSubscribed(!!subscription);

        if (subscription) {
          // Fetch categories for this subscription
          const response = await fetch('/api/push/get-categories', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ endpoint: subscription.endpoint }),
          });

          if (response.ok) {
            const data = await response.json();
            setSelectedCategories(data.categories || []);
          }
        }
      } catch (err) {
        console.error('Error checking subscription:', err);
        setError('Failed to check subscription status');
      }
    };

    checkSubscription();
  }, []);

  // Subscribe to push notifications
  const subscribeToPush = async () => {
    if (!isPushSupported()) {
      setError('Push notifications are not supported in your browser');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Request permission
      const permission = await Notification.requestPermission();
      setPermission(permission);

      if (permission !== 'granted') {
        setError('Permission for notifications was denied');
        setIsLoading(false);
        return;
      }

      // Register service worker if not already registered
      if (!navigator.serviceWorker.controller) {
        await navigator.serviceWorker.register('/sw.js');
      }

      const registration = await navigator.serviceWorker.ready;

      // Get the server's public key
      const response = await fetch('/api/push/vapid-public-key');
      const { publicKey } = await response.json();

      // Subscribe the user
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey)
      });

      // Send the subscription to the server
      const saveResponse = await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subscription,
          categories: selectedCategories
        }),
      });

      if (!saveResponse.ok) {
        throw new Error('Failed to save subscription on server');
      }

      setIsSubscribed(true);
      setIsLoading(false);
    } catch (err) {
      console.error('Error subscribing to push:', err);
      setError('Failed to subscribe to push notifications');
      setIsLoading(false);
    }
  };

  // Unsubscribe from push notifications
  const unsubscribeFromPush = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();

      if (subscription) {
        // Send the unsubscribe request to the server
        const response = await fetch('/api/push/unsubscribe', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            endpoint: subscription.endpoint
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to unsubscribe on server');
        }

        // Unsubscribe on the browser
        await subscription.unsubscribe();
      }

      setIsSubscribed(false);
      setSelectedCategories([]);
      setIsLoading(false);
    } catch (err) {
      console.error('Error unsubscribing from push:', err);
      setError('Failed to unsubscribe from push notifications');
      setIsLoading(false);
    }
  };

  // Update categories for an existing subscription
  const updateCategories = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();

      if (!subscription) {
        setError('No active subscription found');
        setIsLoading(false);
        return;
      }

      // Update categories on the server
      const response = await fetch('/api/push/update-categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          endpoint: subscription.endpoint,
          categories: selectedCategories
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update categories on server');
      }

      setIsLoading(false);
    } catch (err) {
      console.error('Error updating categories:', err);
      setError('Failed to update notification preferences');
      setIsLoading(false);
    }
  };

  // Handle category selection
  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  // Convert base64 to Uint8Array for applicationServerKey
  const urlBase64ToUint8Array = (base64String: string) => {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }

    return outputArray;
  };

  if (!isPushSupported()) {
    return (
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 p-4 rounded-r-lg">
        <p className="text-yellow-700 dark:text-yellow-300">
          Push notifications are not supported in your browser. Please try a different browser like Chrome, Firefox, or Edge.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        Push Notifications
      </h2>
      <p className="text-gray-600 dark:text-gray-300 mb-6">
        Get instant notifications on your device when new posts are published in your favorite categories.
      </p>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 mb-6">
          <p className="text-red-700 dark:text-red-300">{error}</p>
        </div>
      )}

      {permission === 'denied' && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 p-4 mb-6">
          <p className="text-yellow-700 dark:text-yellow-300">
            Notifications are blocked for this site. Please update your browser settings to allow notifications.
          </p>
        </div>
      )}

      {isSubscribed && (
        <div className="bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 p-4 mb-6">
          <p className="text-green-700 dark:text-green-300">
            You are currently subscribed to push notifications.
          </p>
        </div>
      )}

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Categories (Select which topics you want to be notified about)
        </label>
        <div className="space-y-2">
          {categories && categories.length > 0 ? (
            categories.map((category) => (
              <div key={category._id} className="flex items-center">
                <input
                  id={`push-category-${category._id}`}
                  type="checkbox"
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  checked={selectedCategories.includes(category._id)}
                  onChange={() => handleCategoryChange(category._id)}
                  disabled={isLoading || (!isSubscribed && permission !== 'granted')}
                />
                <label
                  htmlFor={`push-category-${category._id}`}
                  className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                >
                  {category.title}
                </label>
              </div>
            ))
          ) : (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 p-4 rounded-r-lg">
              <p className="text-yellow-700 dark:text-yellow-300">
                No categories found. Please add categories in the Sanity Studio first.
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        {!isSubscribed ? (
          <button
            onClick={subscribeToPush}
            disabled={isLoading || permission === 'denied'}
            className={`px-4 py-2 bg-gradient-primary text-white font-medium rounded-md shadow-sm transition-all duration-200 hover:opacity-90 hover:shadow-md ${
              (isLoading || permission === 'denied') ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? 'Subscribing...' : 'Subscribe to Notifications'}
          </button>
        ) : (
          <>
            <button
              onClick={updateCategories}
              disabled={isLoading}
              className={`px-4 py-2 bg-gradient-primary text-white font-medium rounded-md shadow-sm transition-all duration-200 hover:opacity-90 hover:shadow-md ${
                isLoading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? 'Updating...' : 'Update Preferences'}
            </button>

            <button
              onClick={unsubscribeFromPush}
              disabled={isLoading}
              className={`px-4 py-2 bg-white border border-gray-300 text-gray-700 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 font-medium rounded-md shadow-sm transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-600 ${
                isLoading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? 'Unsubscribing...' : 'Unsubscribe'}
            </button>
          </>
        )}
      </div>

      <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
        You can change your notification preferences or unsubscribe at any time.
      </p>
    </div>
  );
};

export default PushNotificationForm;
