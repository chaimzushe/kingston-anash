import LogRocket from './logrocket';

/**
 * Identify a user in LogRocket
 * Call this function when a user logs in
 */
export function identifyUser(userId: string, userTraits?: Record<string, any>) {
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
    LogRocket.identify(userId, userTraits);
  }
}

/**
 * Track a custom event in LogRocket
 */
export function trackEvent(name: string, properties?: Record<string, any>) {
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
    LogRocket.track(name, properties);
  }
}

/**
 * Add a custom tag to the current session
 */
export function addSessionTag(name: string, value: string) {
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
    LogRocket.getSessionURL((sessionURL) => {
      console.log('LogRocket session URL:', sessionURL);
    });
    
    LogRocket.track('Session Tag', { [name]: value });
  }
}
