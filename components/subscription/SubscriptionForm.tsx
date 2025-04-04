"use client";

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';

interface Category {
  _id: string;
  title: string;
}

interface SubscriptionFormProps {
  categories: Category[];
}

interface FormData {
  email: string;
  categories: string[];
}

const SubscriptionForm: React.FC<SubscriptionFormProps> = ({ categories }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>();
  
  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');
    
    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Failed to subscribe');
      }
      
      setSubmitStatus('success');
      reset();
    } catch (error) {
      setSubmitStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'An unknown error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        Subscribe to Updates
      </h2>
      <p className="text-gray-600 dark:text-gray-300 mb-6">
        Get notified when new posts are published in your favorite categories.
      </p>
      
      {submitStatus === 'success' ? (
        <div className="bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 p-4 mb-6">
          <p className="text-green-700 dark:text-green-300">
            Thanks for subscribing! Please check your email to confirm your subscription.
          </p>
        </div>
      ) : submitStatus === 'error' ? (
        <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 mb-6">
          <p className="text-red-700 dark:text-red-300">
            {errorMessage || 'Something went wrong. Please try again.'}
          </p>
        </div>
      ) : null}
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            className={`w-full px-4 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white`}
            placeholder="your@email.com"
            {...register('email', { 
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address'
              }
            })}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email.message}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Categories (Select at least one)
          </label>
          <div className="space-y-2">
            {categories.map((category) => (
              <div key={category._id} className="flex items-center">
                <input
                  id={`category-${category._id}`}
                  type="checkbox"
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  value={category._id}
                  {...register('categories', { required: 'Please select at least one category' })}
                />
                <label
                  htmlFor={`category-${category._id}`}
                  className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                >
                  {category.title}
                </label>
              </div>
            ))}
          </div>
          {errors.categories && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.categories.message}</p>
          )}
        </div>
        
        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full px-4 py-2 bg-gradient-primary text-white font-medium rounded-md shadow-sm transition-all duration-200 hover:opacity-90 hover:shadow-md ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isSubmitting ? 'Subscribing...' : 'Subscribe'}
          </button>
        </div>
        
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
          We respect your privacy. You can unsubscribe at any time using the link in our emails.
        </p>
      </form>
    </div>
  );
};

export default SubscriptionForm;
