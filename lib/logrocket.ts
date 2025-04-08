import LogRocket from 'logrocket';

// Initialize LogRocket with your app ID from environment variables
export const initLogRocket = () => {
  const appId = process.env.NEXT_PUBLIC_LOGROCKET_APP_ID;

  // Initialize in both production and development
  if (typeof window !== 'undefined' && appId) {
    // Initialize LogRocket with advanced options
    LogRocket.init(appId, {
      release: process.env.NEXT_PUBLIC_APP_VERSION || 'development',
      console: {
        isEnabled: true,
        shouldAggregateConsoleErrors: true,
      },
      network: {
        isEnabled: true,
        requestSanitizer: (request) => {
          // Sanitize sensitive data from requests if needed
          return request;
        },
      },
      dom: {
        isEnabled: true,
        inputSanitizer: true, // Automatically sanitize user inputs
      },
    });

    // Default site identification
    LogRocket.identify('Kingston anash', {
      name: 'kingston anash',
      environment: process.env.NODE_ENV || 'development',
    });

    // Add global error tracking
    setupErrorTracking();

    // Log initial page view
    logPageView(window.location.pathname + window.location.search);

    console.log(`LogRocket initialized in ${process.env.NODE_ENV} mode`);
  } else if (typeof window !== 'undefined') {
    console.log('LogRocket would initialize with app ID:', appId || 'not set');
  }
};

// Log page views
export function logPageView(url: string) {
  if (typeof window !== 'undefined') {
    LogRocket.track('page_view', {
      url,
      referrer: document.referrer,
      title: document.title,
    });
  }
}

// Set up global error tracking
function setupErrorTracking() {
  // Capture unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    LogRocket.captureException(event.reason);
  });

  // Capture uncaught exceptions
  window.addEventListener('error', (event) => {
    LogRocket.captureException(event.error);
  });

  // Override console.error to capture errors
  const originalConsoleError = console.error;
  console.error = (...args) => {
    // Log to LogRocket
    if (args[0] instanceof Error) {
      LogRocket.captureException(args[0]);
    } else {
      LogRocket.captureMessage(args.join(' '));
    }

    // Call the original console.error
    originalConsoleError.apply(console, args);
  };
}

export default LogRocket;
