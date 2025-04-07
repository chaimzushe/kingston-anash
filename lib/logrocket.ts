import LogRocket from 'logrocket';

// Initialize LogRocket with your app ID from environment variables
export const initLogRocket = () => {
  const appId = process.env.NEXT_PUBLIC_LOGROCKET_APP_ID;

  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production' && appId) {
    LogRocket.init(appId);
    LogRocket.identify('Kingston anash', {
      name: 'kingston anash',
    });
    // Add global error tracking
    setupErrorTracking();

    // You can add custom user identification
    // LogRocket.identify('user-id', {
    //   name: 'User Name',
    //   email: 'user@example.com',
    //   // Add any other user traits you want to track
    // });

    console.log('LogRocket initialized');
  } else if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    console.log('LogRocket would initialize with app ID:', appId || 'not set');
  }
};

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
