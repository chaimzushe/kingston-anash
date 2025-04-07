"use client";

import { useEffect, useState } from 'react';

interface CacheBusterProps {
  children: React.ReactNode;
}

/**
 * Component that forces a refresh when a new version is detected
 */
const CacheBuster: React.FC<CacheBusterProps> = ({ children }) => {
  const [isLatestVersion, setIsLatestVersion] = useState(true);
  const [buildId, setBuildId] = useState<string | null>(null);

  useEffect(() => {
    // Get the current build ID from environment variable
    const currentBuildId = process.env.NEXT_PUBLIC_BUILD_TIME || null;
    setBuildId(currentBuildId);

    // Function to check for new version
    const checkVersion = async () => {
      try {
        // Fetch the build ID from a special endpoint with cache busting
        const response = await fetch(`/api/build-id?t=${Date.now()}`);
        const data = await response.json();
        
        // If the build ID doesn't match, we have a new version
        if (currentBuildId && data.buildId && currentBuildId !== data.buildId) {
          console.log(`New version detected. Current: ${currentBuildId}, Latest: ${data.buildId}`);
          setIsLatestVersion(false);
        }
      } catch (error) {
        console.error('Failed to check for new version:', error);
      }
    };

    // Check for new version on mount and every 5 minutes
    checkVersion();
    const interval = setInterval(checkVersion, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  // Force refresh when a new version is detected
  const refreshPage = () => {
    window.location.reload();
  };

  return (
    <>
      {children}
      
      {/* Show refresh notification if a new version is detected */}
      {!isLatestVersion && (
        <div className="fixed bottom-4 right-4 bg-primary text-white px-4 py-3 rounded-lg shadow-lg z-50 flex items-center space-x-3">
          <span>New version available!</span>
          <button 
            onClick={refreshPage}
            className="bg-white text-primary px-3 py-1 rounded font-medium text-sm hover:bg-gray-100 transition-colors"
          >
            Refresh
          </button>
        </div>
      )}
    </>
  );
};

export default CacheBuster;
