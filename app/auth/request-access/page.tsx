"use client";

import React, { useState, useEffect, Suspense } from 'react';
import "../signin/[[...sign-in]]/signin.css";
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { SignIn } from '@clerk/nextjs';
import { PageHeader } from '@/components/layout';

// Component that uses the search params (needs to be wrapped in Suspense)
function RequestAccessForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error' | 'checking' | 'authorized'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [showSignIn, setShowSignIn] = useState(false);
  const [redirectUrl, setRedirectUrl] = useState('');

  const router = useRouter();

  // Import useSearchParams and useSignIn inside the component that will be wrapped in Suspense
  const { useSearchParams, useSignIn } = require('next/navigation');
  const searchParams = useSearchParams();
  const { isLoaded: isSignInLoaded, signIn, setActive } = useSignIn ? useSignIn() : { isLoaded: false, signIn: null, setActive: null };

  // Get the redirect URL from query parameters
  useEffect(() => {
    if (searchParams) {
      const redirect = searchParams.get('redirect_url');
      if (redirect) {
        setRedirectUrl(redirect);
      }
    }
  }, [searchParams]);

  // Check if the email is already authorized
  const checkEmailAuthorization = async (emailToCheck: string) => {
    setStatus('checking');
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/validate-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: emailToCheck }),
      });

      const data = await response.json();

      if (data.isValid) {
        // Email is authorized, show sign-in form
        setStatus('authorized');
        setShowSignIn(true);
      } else {
        // Email is not authorized, continue with request access form
        setStatus('idle');
        setErrorMessage('This email is not authorized yet. Please submit an access request.');
      }
    } catch (error) {
      setStatus('error');
      setErrorMessage('Failed to check email authorization. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle email check when user enters email and clicks "Check Email"
  const handleEmailCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setErrorMessage('Please enter your email address');
      return;
    }
    await checkEmailAuthorization(email);
  };

  // Handle the access request submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus('idle');
    setErrorMessage('');

    try {
      const response = await fetch('/api/auth/request-access', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          phone,
          message
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to submit request');
      }

      setStatus('success');
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
    } catch (error) {
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle successful sign-in
  const handleSignInComplete = async (result: any) => {
    if (result?.createdSessionId) {
      // Set the session as active if setActive is available
      if (setActive) {
        await setActive({ session: result.createdSessionId });
      }

      // Redirect to the original URL or home page
      if (redirectUrl) {
        router.push(redirectUrl);
      } else {
        router.push('/');
      }
    }
  };

  return (
    <div className="min-h-screen py-8 sm:py-12 px-2 sm:px-6 lg:px-8 pattern-overlay">
      <div className="w-full sm:max-w-xl lg:max-w-2xl mx-auto">
        <PageHeader
          title="Request Community Access"
          subtitle="Submit your information to request access to the community directory. Only administrators can approve new members."
        />

        <div className="bg-white dark:bg-gray-800 rounded-lg p-3 sm:p-6 mt-4 sm:mt-8">
          {status === 'success' ? (
            <div className="space-y-6">
              <div className="bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 p-3 sm:p-4 rounded">
                <p className="text-green-700 dark:text-green-300">
                  Your access request has been submitted successfully. An administrator will review your request and create an account for you if approved. You will be contacted with your login credentials.
                </p>
              </div>

              <div className="flex flex-col space-y-4">
                <Link
                  href="/"
                  className="px-4 py-2 bg-white border border-gray-300 text-gray-700 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 font-medium rounded-md transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-600 text-center"
                >
                  Return to Home
                </Link>
              </div>
            </div>
          ) : showSignIn ? (
            <div className="space-y-6">
              <div className="bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 p-3 sm:p-4 mb-6 rounded">
                <p className="text-green-700 dark:text-green-300">
                  Your email has been verified. Please sign in to continue.
                </p>
              </div>

              {isSignInLoaded && (
                <SignIn
                  signInUrl="/auth/signin"
                  redirectUrl={redirectUrl || '/'}
                  afterSignInUrl={redirectUrl || '/'}
                  signUpUrl="/auth/request-access"
                  afterSignUpUrl={redirectUrl || '/'}
                  appearance={{
                    elements: {
                      formButtonPrimary:
                        "bg-gradient-primary text-white font-medium rounded-md transition-all duration-200 hover:opacity-90",
                      card: "bg-transparent shadow-none",
                      rootBox: "w-full",
                      formFieldInput: "w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white",
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
                />
              )}
            </div>
          ) : status === 'checking' ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : (
            <>
              {status === 'error' && (
                <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 mb-6">
                  <p className="text-red-700 dark:text-red-300">
                    {errorMessage || 'Something went wrong. Please try again.'}
                  </p>
                </div>
              )}

              {/* Email Check Form */}
              <div className="mb-8 p-4 border border-gray-200 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-800/50">
                <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-gray-100">Already a community member?</h3>
                <form className="space-y-4" onSubmit={handleEmailCheck}>
                  <div>
                    <label htmlFor="check-email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Email Address
                    </label>
                    <input
                      id="check-email"
                      name="check-email"
                      type="email"
                      required
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full px-4 py-2 bg-gradient-primary text-white font-medium rounded-md transition-all duration-200 hover:opacity-90 cursor-pointer border-0 ${
                      isLoading ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                  >
                    {isLoading ? 'Checking...' : 'Check Email'}
                  </button>
                </form>
              </div>

              {/* Request Access Form */}
              <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-gray-100">Request New Access</h3>
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Full Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
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
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Phone Number
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
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
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
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
                    {isLoading ? 'Submitting...' : 'Submit Request'}
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

// Main component that doesn't use useSearchParams directly
export default function RequestAccess() {
  return (
    <div className="min-h-screen py-8 sm:py-12 px-2 sm:px-6 lg:px-8 pattern-overlay">
      <div className="w-full sm:max-w-xl lg:max-w-2xl mx-auto">
       
        <div className="bg-white dark:bg-gray-800 rounded-lg p-3 sm:p-6 mt-4 sm:mt-8">
          <Suspense fallback={
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          }>
            <RequestAccessForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}