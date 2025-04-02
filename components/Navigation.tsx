"use client";

import React, { useState } from 'react';
import Link from 'next/link';


const Navigation = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  return (
    <nav className="bg-white dark:bg-gray-900 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-gray-800 dark:text-white">Kingston Anash</span>
            </Link>
          </div>

          <div className="hidden md:flex md:items-center md:space-x-6">
            <div className="relative group">
              <button className="flex items-center text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium">
                <span>News</span>
                <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {/* Invisible padding element to prevent hover gap */}
              <div className="absolute inset-x-0 h-2 -bottom-2"></div>
              <div className="absolute left-0 top-full w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 ease-in-out z-10 transform origin-top-left group-hover:translate-y-0 -translate-y-1">
                <div className="py-1" role="menu" aria-orientation="vertical">
                  <a href="https://collive.com" target="_blank" rel="noopener noreferrer" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700" role="menuitem">COLlive</a>
                  <a href="https://crownheights.info" target="_blank" rel="noopener noreferrer" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700" role="menuitem">Crown Heights Info</a>
                  <a href="https://anash.org" target="_blank" rel="noopener noreferrer" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700" role="menuitem">Anash.org</a>
                  <a href="https://chabad.org/news" target="_blank" rel="noopener noreferrer" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700" role="menuitem">Chabad.org News</a>
                </div>
              </div>
            </div>

            <div className="relative group">
              <button className="flex items-center text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium">
                <span>Minyanim</span>
                <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {/* Invisible padding element to prevent hover gap */}
              <div className="absolute inset-x-0 h-2 -bottom-2"></div>
              <div className="absolute left-0 top-full w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 ease-in-out z-10 transform origin-top-left group-hover:translate-y-0 -translate-y-1">
                <div className="py-1" role="menu" aria-orientation="vertical">
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700" role="menuitem">770 Eastern Parkway</a>
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700" role="menuitem">Kingston Avenue Shul</a>
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700" role="menuitem">Beis Rivkah</a>
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700" role="menuitem">Oholei Torah</a>
                </div>
              </div>
            </div>

            <Link href="#" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium">
              Community
            </Link>

            <Link href="#" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium">
              Events
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center">
            <button
              type="button"
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              aria-expanded={isMobileMenuOpen ? 'true' : 'false'}
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      <div className={`${isMobileMenuOpen ? 'block' : 'hidden'} md:hidden transition-all duration-300 ease-in-out`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <div className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300">
            <div className="mb-2">News</div>
            <div className="pl-4 space-y-1 text-sm">
              <a href="https://collive.com" target="_blank" rel="noopener noreferrer" className="block py-1 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">COLlive</a>
              <a href="https://crownheights.info" target="_blank" rel="noopener noreferrer" className="block py-1 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">Crown Heights Info</a>
              <a href="https://anash.org" target="_blank" rel="noopener noreferrer" className="block py-1 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">Anash.org</a>
              <a href="https://chabad.org/news" target="_blank" rel="noopener noreferrer" className="block py-1 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">Chabad.org News</a>
            </div>
          </div>

          <div className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300">
            <div className="mb-2">Minyanim</div>
            <div className="pl-4 space-y-1 text-sm">
              <a href="#" className="block py-1 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">770 Eastern Parkway</a>
              <a href="#" className="block py-1 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">Kingston Avenue Shul</a>
              <a href="#" className="block py-1 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">Beis Rivkah</a>
              <a href="#" className="block py-1 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">Oholei Torah</a>
            </div>
          </div>

          <a href="#" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700">Community</a>
          <a href="#" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700">Events</a>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
