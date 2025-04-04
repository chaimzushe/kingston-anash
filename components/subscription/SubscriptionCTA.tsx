"use client";

import React from 'react';
import Link from 'next/link';

const SubscriptionCTA: React.FC = () => {
  return (
    <div className="bg-gradient-primary text-white rounded-lg shadow-lg p-6 sm:p-8 my-12">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-2xl sm:text-3xl font-bold mb-4">
          Stay Updated with Kingston Anash
        </h2>
        <p className="text-lg mb-6 opacity-90">
          Subscribe to receive notifications about new posts in your favorite categories.
        </p>
        <Link 
          href="/subscribe" 
          className="inline-block px-6 py-3 bg-white text-primary font-medium rounded-md shadow-md transition-all duration-200 hover:bg-gray-100 hover:shadow-lg"
        >
          Subscribe Now
        </Link>
      </div>
    </div>
  );
};

export default SubscriptionCTA;
