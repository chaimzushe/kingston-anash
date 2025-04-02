"use client";

import React from 'react';

interface DropdownItem {
  label: string;
  href: string;
  isExternal?: boolean;
}

interface DropdownMenuProps {
  label: string;
  items: DropdownItem[];
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({ label, items }) => {
  return (
    <div className="relative group">
      <button className="flex items-center text-white hover:text-amber-200 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200">
        <span>{label}</span>
        <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Invisible padding element to prevent hover gap */}
      <div className="absolute inset-x-0 h-2 -bottom-2"></div>

      <div className="absolute left-0 top-full w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 border-t-2 border-amber-400 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 ease-in-out z-10 transform origin-top-left group-hover:translate-y-0 -translate-y-1">
        <div className="py-1" role="menu" aria-orientation="vertical">
          {items.map((item, index) => (
            <a
              key={index}
              href={item.href}
              target={item.isExternal ? "_blank" : undefined}
              rel={item.isExternal ? "noopener noreferrer" : undefined}
              className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-gray-700 transition-colors duration-150"
              role="menuitem"
            >
              {item.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DropdownMenu;
