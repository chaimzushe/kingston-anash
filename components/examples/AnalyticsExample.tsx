'use client';

import React, { useState } from 'react';
import { 
  trackButtonClick, 
  trackFormSubmission, 
  trackFeatureUsage, 
  trackError 
} from '../../lib/analytics';

export default function AnalyticsExample() {
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [submitted, setSubmitted] = useState(false);

  // Example of tracking a button click
  const handleButtonClick = () => {
    // Track the button click
    trackButtonClick('example_button', {
      page: 'analytics_example',
      section: 'demo'
    });
    
    alert('Button clicked and tracked!');
  };

  // Example of tracking a form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Simulate form processing
      if (!formData.name || !formData.email) {
        throw new Error('Please fill out all fields');
      }
      
      // Track successful form submission
      trackFormSubmission('example_form', true, {
        has_name: Boolean(formData.name),
        has_email: Boolean(formData.email),
        email_domain: formData.email.split('@')[1] || 'unknown'
      });
      
      setSubmitted(true);
    } catch (error) {
      // Track form submission error
      trackError(
        'form_validation', 
        error instanceof Error ? error.message : 'Unknown error',
        { form_name: 'example_form' }
      );
      
      alert(error instanceof Error ? error.message : 'An error occurred');
    }
  };

  // Example of tracking feature usage
  const handleFeatureUse = () => {
    trackFeatureUsage('example_feature', {
      action: 'toggle',
      state: 'active'
    });
    
    alert('Feature usage tracked!');
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-4">Analytics Examples</h2>
      
      <div className="space-y-6">
        {/* Button click tracking example */}
        <div>
          <h3 className="text-lg font-medium mb-2">Track Button Click</h3>
          <button
            onClick={handleButtonClick}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Click Me
          </button>
        </div>
        
        {/* Form submission tracking example */}
        <div>
          <h3 className="text-lg font-medium mb-2">Track Form Submission</h3>
          {submitted ? (
            <div className="bg-green-50 border-l-4 border-green-500 p-4">
              <p className="text-green-700">Form submitted successfully!</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-1">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Submit Form
              </button>
            </form>
          )}
        </div>
        
        {/* Feature usage tracking example */}
        <div>
          <h3 className="text-lg font-medium mb-2">Track Feature Usage</h3>
          <button
            onClick={handleFeatureUse}
            className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
          >
            Use Feature
          </button>
        </div>
      </div>
    </div>
  );
}
