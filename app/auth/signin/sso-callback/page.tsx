export default function SSOCallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-gray-300 dark:border-gray-600 border-t-primary mx-auto"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-400">Redirecting...</p>
        <script dangerouslySetInnerHTML={{
          __html: `
            document.addEventListener('DOMContentLoaded', function() {
              const urlParams = new URLSearchParams(window.location.search);
              const redirectUrl = urlParams.get('redirect_url');
              if (redirectUrl) {
                window.location.href = redirectUrl;
              } else {
                window.location.href = '/auth/signin';
              }
            });
          `
        }} />
      </div>
    </div>
  );
}
