"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useUser, useClerk } from '@clerk/nextjs';
import { mainNavItems, dropdownMenus } from '../../data/navigationData';

interface MobileNavProps {
  isOpen: boolean;
  onClose?: () => void;
}

const MobileNav: React.FC<MobileNavProps> = ({ isOpen, onClose }) => {
  const [expandedSections, setExpandedSections] = useState<string[]>([]);

  const toggleSection = (section: string) => {
    setExpandedSections(prev =>
      prev.includes(section)
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const isSectionExpanded = (section: string) => expandedSections.includes(section);

  return (
    <div className={`${isOpen ? 'block' : 'hidden'} md:hidden fixed inset-0 top-0 left-0 right-0 bottom-0 z-[100] overflow-y-auto transition-all duration-300 ease-in-out bg-gradient-primary bg-opacity-95 backdrop-blur-sm`}>
      <div className="px-4 py-6 space-y-4 max-h-screen overflow-y-auto">
        {/* Close button */}
        <div className="flex justify-end mb-2">
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-blue-800 hover:bg-blue-700 transition-colors duration-150 focus:outline-none"
            aria-label="Close menu"
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Render dropdown menus */}
        {dropdownMenus.map((menu, index) => (
          <div key={index} className="block rounded-md text-base font-medium text-white">
            <button
              onClick={() => toggleSection(menu.label)}
              className="flex items-center justify-between w-full py-3 border-b border-blue-400 focus:outline-none focus:ring-0"
            >
              <div className="flex items-center space-x-2">
                {menu.label === 'Community' ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ) : menu.label === 'Minyanim' ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
                <span className="text-lg">{menu.label}</span>
              </div>
              <svg
                className={`w-5 h-5 transition-transform duration-200 ${isSectionExpanded(menu.label) ? 'transform rotate-180' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {isSectionExpanded(menu.label) && (
              <div className="pl-4 pt-3 pb-1 space-y-3 bg-blue-900/30 rounded-md mt-2 mb-2">
                {menu.items.map((item, itemIndex) => (
                  <a
                    key={itemIndex}
                    href={item.href}
                    target={item.isExternal ? "_blank" : undefined}
                    rel={item.isExternal ? "noopener noreferrer" : undefined}
                    className="block py-3 px-3 text-white hover:text-amber-200 transition-colors duration-150 border-b border-blue-800/50 last:border-b-0"
                    onClick={onClose}
                  >
                    <span>{item.label}</span>
                  </a>
                ))}
              </div>
            )}
          </div>
        ))}

        {/* Render regular nav links */}
        {mainNavItems.map((item, index) => (
          <a
            key={index}
            href={item.href}
            target={item.isExternal ? "_blank" : undefined}
            rel={item.isExternal ? "noopener noreferrer" : undefined}
            className="block py-3 text-lg font-medium text-white hover:text-amber-200 transition-colors duration-150 border-b border-blue-400"
            onClick={onClose}
          >
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span>{item.label}</span>
            </div>
          </a>
        ))}

        {/* Authentication Links */}

          <MobileAuthLinks onClose={onClose} />

      </div>
    </div>
  );
};

// Mobile Authentication Links Component
interface MobileAuthLinksProps {
  onClose?: () => void;
}

const MobileAuthLinks: React.FC<MobileAuthLinksProps> = ({ onClose }) => {
  const { isSignedIn } = useUser();
  const { signOut } = useClerk();

  const handleSignOut = async () => {
    // Close the mobile menu if onClose is provided
    if (onClose) onClose();
    try {
      await signOut();
      // Force a hard refresh to ensure all state is cleared
      window.location.href = "/";
    } catch (error) {
      console.error("Error signing out:", error);
      // If Clerk signOut fails, force a hard refresh anyway
      window.location.href = "/";
    }
  };

  // If not authenticated, return null
  if (!isSignedIn) {
    return null;
  }

  // If authenticated, show the user menu
  return (
    <div className="space-y-4">


      <Link
        href="/profile"
        className="block py-3 text-lg font-medium text-white hover:text-amber-200 transition-colors duration-150 border-b border-blue-400"
        onClick={onClose}
      >
        <div className="flex items-center space-x-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span>My Profile</span>
        </div>
      </Link>



      <button
        onClick={handleSignOut}
        className="block w-full text-left py-3 text-lg font-medium text-white hover:text-amber-200 transition-colors duration-150 cursor-pointer border-b border-blue-400"
      >
        <div className="flex items-center space-x-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span>Sign Out</span>
        </div>
      </button>
    </div>
  );
};

export default MobileNav;
