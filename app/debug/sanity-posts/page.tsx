"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function SanityPostsPage() {
  const [status, setStatus] = useState("idle");
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const checkSanityPosts = async () => {
    try {
      setStatus("loading");
      setError(null);

      const response = await fetch('/api/debug/sanity-posts');
      const data = await response.json();

      setResult(data);
      setStatus(data.success ? "success" : "error");

      if (!data.success) {
        setError(data.error || "Unknown error");
      }
    } catch (error) {
      console.error('Error checking Sanity posts:', error);
      setStatus("error");
      setError(error instanceof Error ? error.message : "An error occurred");
      setResult(null);
    }
  };

  useEffect(() => {
    checkSanityPosts();
  }, []);

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Sanity Posts Check</h1>

        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Posts Status</h2>
            <button
              onClick={checkSanityPosts}
              disabled={status === "loading"}
              className={`px-4 py-2 rounded-md ${
                status === "loading"
                  ? "bg-gray-300 text-gray-700 cursor-not-allowed"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              }`}
            >
              {status === "loading" ? "Checking..." : "Check Again"}
            </button>
          </div>

          {status === "loading" && (
            <div className="flex justify-center my-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          )}

          {status === "success" && result && (
            <div className="p-4 bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 text-green-700 dark:text-green-300 mb-6">
              <p className="font-medium">{result.message}</p>
            </div>
          )}

          {status === "error" && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 text-red-700 dark:text-red-300 mb-6">
              <p className="font-medium">Connection failed: {error}</p>
            </div>
          )}

          {result && (
            <div>
              <h3 className="text-lg font-medium mb-2">Sanity Configuration</h3>
              <div className="bg-gray-100 dark:bg-gray-900 p-4 rounded-md mb-6">
                <pre className="text-sm overflow-auto">
                  {JSON.stringify(result.config, null, 2)}
                </pre>
              </div>

              {result.posts && result.posts.length > 0 && (
                <>
                  <h3 className="text-lg font-medium mb-2">Sample Posts</h3>
                  <div className="bg-gray-100 dark:bg-gray-900 p-4 rounded-md overflow-auto max-h-96">
                    <pre className="text-sm">
                      {JSON.stringify(result.posts, null, 2)}
                    </pre>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        <div className="flex justify-center space-x-4">
          <Link
            href="/"
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
