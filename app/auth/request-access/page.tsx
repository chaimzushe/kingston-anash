"use client";

import React, { useState, useEffect } from 'react';
import { SignUp, useSignUp } from '@clerk/nextjs';
import { PageHeader } from '@/components/layout';
import './signup.css';

export default function RequestAccess() {
  const { isLoaded, signUp } = useSignUp();
  const [step, setStep] = useState<'form' | 'clerk' | 'success'>('form');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  // Track if the form has been submitted to Clerk

  // Check if the sign-up was completed
  useEffect(() => {
    if (isLoaded && signUp?.status === 'complete') {
      handleClerkSignUpComplete();
    }
  }, [isLoaded, signUp?.status]);

  // Handle the initial form submission
  const handleInitialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    try {
      // First, check if the email already exists in Sanity
      const checkResponse = await fetch('/api/auth/validate-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const checkData = await checkResponse.json();

      // If the email already exists, show an error
      if (checkData.status === 'authorized' || checkData.status === 'pending') {
        setErrorMessage(checkData.message || 'This email is already registered or has a pending request.');
        setIsLoading(false);
        return;
      }

      // If email is not registered, proceed to Clerk signup
      setStep('clerk');
    } catch (error) {
      setErrorMessage('Failed to check email. Please try again.');
      console.error('Email check error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Clerk sign-up completion
  const handleClerkSignUpComplete = async () => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      // Create a pending access request in Sanity
      const response = await fetch('/api/auth/request-access', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          phone,
          message,
          clerkUserId: signUp?.createdUserId || '',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to submit request');
      }

      // Show success message
      setStep('success');
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'An unknown error occurred');
      console.error('Request access error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-8 sm:py-12 px-1 sm:px-6 lg:px-8 pattern-overlay">
      <div className="w-full sm:max-w-xl lg:max-w-2xl mx-auto">
        <PageHeader
          title="Request Community Access"
          subtitle="Join our community to access exclusive features and connect with other members."
        />

        <div className="bg-white dark:bg-gray-800 rounded-lg p-2 sm:p-6 mt-4 sm:mt-8">
          {step === 'success' ? (
            <div className="space-y-6">
              <div className="bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 p-3 sm:p-4 rounded">
                <p className="text-green-700 dark:text-green-300">
                  Your account has been created and your access request has been submitted successfully. An administrator will review your request and approve your account if appropriate. You will receive an email notification when your account is approved.
                </p>
              </div>

              <div className="flex flex-col space-y-4">
                <a
                  href="/"
                  className="px-4 py-2 bg-white border border-gray-300 text-gray-700 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 font-medium rounded-md transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-600 text-center"
                >
                  Return to Home
                </a>
              </div>
            </div>
          ) : step === 'clerk' ? (
            <div className="space-y-6">
              <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-3 sm:p-4 rounded">
                <p className="text-blue-700 dark:text-blue-300">
                  Please create your account credentials. Once your account is created, your access request will be submitted for review.
                </p>
              </div>

              <SignUp
                appearance={{
                  elements: {
                    formButtonPrimary:
                      "bg-gradient-primary text-white font-medium rounded-md transition-all duration-200 hover:opacity-90",
                    card: "bg-transparent shadow-none",
                    rootBox: "w-full",
                    formFieldInput: "w-full px-2 sm:px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white",
                    formButtonReset: "text-primary hover:text-primary-dark",
                    card__innerHeader: "border-none hidden",
                    card__innerFooter: "border-none",
                    form: "shadow-none",
                    formField__label: "font-medium",
                    identityPreview: "shadow-none border border-gray-200 dark:border-gray-700",
                    alert: "shadow-none border border-gray-200 dark:border-gray-700",
                    headerTitle: "hidden",
                    headerSubtitle: "hidden",
                  }
                }}
                initialValues={{
                  emailAddress: email,
                  firstName: name.split(' ')[0] || '',
                  lastName: name.split(' ').slice(1).join(' ') || ''
                }}
                signInUrl="/auth/signin"
                // Redirect handled in useEffect
                unsafeMetadata={{
                  phone,
                  message,
                  pendingApproval: true
                }}
              />

              {/* Back button */}
              <div className="mt-4">
                <button
                  onClick={() => setStep('form')}
                  className="w-full px-4 py-2 bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-white text-center font-medium rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-200 cursor-pointer border-0"
                >
                  Back to Form
                </button>
              </div>
            </div>
          ) : (
            <>
              {errorMessage && (
                <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-3 sm:p-4 mb-6 rounded">
                  <p className="text-red-700 dark:text-red-300">
                    {errorMessage}
                  </p>
                </div>
              )}

              {/* Already a member section */}
              <div className="mb-8 p-4 border border-gray-200 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-800/50">
                <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-gray-100">Already a community member?</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">If you already have an account, you can sign in to access community features.</p>
                <a
                  href="/auth/signin"
                  className="block w-full py-2.5 px-4 bg-primary text-white text-center font-medium rounded-md hover:bg-primary/90 transition-all duration-200 cursor-pointer border-0"
                >
                  SIGN IN
                </a>
              </div>

              {/* Request Access Form */}
              <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-gray-100">Request New Access</h3>
              <form className="space-y-6" onSubmit={handleInitialSubmit}>
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Full Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    className="w-full px-2 sm:px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
                    placeholder="Your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email Address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="w-full px-2 sm:px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Phone Number (Optional)
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    className="w-full px-2 sm:px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
                    placeholder="(123) 456-7890"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Message (Optional)
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    className="w-full px-2 sm:px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
                    placeholder="Tell us a bit about yourself and why you'd like access to the community directory"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full px-4 py-2 bg-gradient-primary text-white font-medium rounded-md transition-all duration-200 hover:opacity-90 cursor-pointer border-0 ${
                      isLoading ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                  >
                    {isLoading ? 'Processing...' : 'Continue to Create Account'}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
