import LogRocket from './logrocket';

/**
 * Track a user action or event
 * @param eventName Name of the event to track
 * @param properties Additional properties to include with the event
 */
export function trackEvent(eventName: string, properties?: Record<string, any>) {
  if (typeof window !== 'undefined') {
    // Track in LogRocket
    LogRocket.track(eventName, properties);
    
    // You can add other analytics services here (Google Analytics, etc.)
    console.log(`[Analytics] Tracked event: ${eventName}`, properties);
  }
}

/**
 * Track a form submission
 * @param formName Name of the form
 * @param success Whether the submission was successful
 * @param properties Additional properties to include
 */
export function trackFormSubmission(formName: string, success: boolean, properties?: Record<string, any>) {
  trackEvent('form_submission', {
    form_name: formName,
    success,
    ...properties,
  });
}

/**
 * Track a button click
 * @param buttonName Name or identifier of the button
 * @param properties Additional properties to include
 */
export function trackButtonClick(buttonName: string, properties?: Record<string, any>) {
  trackEvent('button_click', {
    button_name: buttonName,
    ...properties,
  });
}

/**
 * Track a feature usage
 * @param featureName Name of the feature being used
 * @param properties Additional properties to include
 */
export function trackFeatureUsage(featureName: string, properties?: Record<string, any>) {
  trackEvent('feature_usage', {
    feature_name: featureName,
    ...properties,
  });
}

/**
 * Track an error that occurred
 * @param errorType Type or category of error
 * @param errorMessage Error message
 * @param properties Additional properties to include
 */
export function trackError(errorType: string, errorMessage: string, properties?: Record<string, any>) {
  trackEvent('error_occurred', {
    error_type: errorType,
    error_message: errorMessage,
    ...properties,
  });
}
