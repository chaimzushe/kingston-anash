"use client";

import { useState } from "react";
import { SignIn } from "@clerk/nextjs";
import "./signin.css";
import { PageHeader } from "@/components/layout";
import Link from "next/link";

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [step, setStep] = useState<'email' | 'password'>('email');
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [emailStatus, setEmailStatus] = useState<'unauthorized' | 'authorized' | 'pending'>('unauthorized');

  // Function to check if email exists in Sanity
  const checkEmailExists = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setErrorMessage('Please enter your email address');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      const response = await fetch('/api/auth/validate-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      setEmailStatus(data.status || 'unauthorized');

      if (data.isValid) {
        // Email is authorized, proceed to password step
        setStep('password');
        setIsEmailValid(true);
      } else if (data.status === 'pending') {
        // Email has a pending request
        setStatusMessage(data.message || 'Your access request is pending approval.');
      } else {
        // Email is not authorized
        setErrorMessage(data.message || 'This email is not authorized. Please request access first.');
      }
    } catch (error) {
      setErrorMessage('Failed to verify email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-8 sm:py-12 px-1 sm:px-6 lg:px-8 pattern-overlay">
      <div className="w-full sm:max-w-xl lg:max-w-2xl mx-auto">
        <PageHeader
          title="Sign In"
          subtitle="Welcome back to Kingston Anash"
        />

        <div className="bg-white dark:bg-gray-800 rounded-lg p-2 sm:p-6 mt-4 sm:mt-8">
          {step === 'email' ? (
            <div className="space-y-6">
              {errorMessage && (
                <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-3 sm:p-4 rounded">
                  <p className="text-red-700 dark:text-red-300">{errorMessage}</p>
                </div>
              )}

              {statusMessage && emailStatus === 'pending' && (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 p-3 sm:p-4 rounded">
                  <p className="text-yellow-700 dark:text-yellow-300">{statusMessage}</p>
                </div>
              )}

              {emailStatus === 'unauthorized' && errorMessage ? (
                <div className="mt-4">
                  <Link
                    href="/auth/request-access"
                    className="block w-full py-2.5 px-4 bg-primary text-white text-center font-medium rounded-md hover:bg-primary/90 transition-all duration-200 cursor-pointer border-0"
                  >
                    REQUEST ACCESS
                  </Link>
                </div>
              ) : null}

              <form onSubmit={checkEmailExists} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email Address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="w-full px-2 sm:px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full px-4 py-2 bg-gradient-primary text-white font-medium rounded-md transition-all duration-200 hover:opacity-90 cursor-pointer border-0 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {isLoading ? 'Verifying...' : 'Continue'}
                </button>
              </form>
            </div>
          ) : (
            <SignIn
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
                emailAddress: email
              }}
            />
          )}

          {/* Request Access Section */}
          <div className="mt-6 sm:mt-8 pt-5 border-t border-gray-200 dark:border-gray-700">
            <div className="text-center">
              <h3 className="text-base font-medium text-gray-900 dark:text-white mb-2">
                Not a community member yet?
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Request access to join our community and use all features
              </p>
              <Link
                href="/auth/request-access"
                className="block w-full py-2.5 sm:py-3 px-4 bg-primary text-white text-center font-medium rounded-md hover:bg-primary/90 transition-all duration-200 cursor-pointer border-0"
              >
                REQUEST ACCESS
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
