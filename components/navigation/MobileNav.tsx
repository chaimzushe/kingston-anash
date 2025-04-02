"use client";

import React, { useState } from 'react';
import { mainNavItems, dropdownMenus } from '../../data/navigationData';

interface MobileNavProps {
  isOpen: boolean;
}

const MobileNav: React.FC<MobileNavProps> = ({ isOpen }) => {
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
    <div className={`${isOpen ? 'block' : 'hidden'} md:hidden transition-all duration-300 ease-in-out bg-gradient-primary bg-opacity-95`}>
      <div className="px-4 py-4 space-y-4">

        {/* Render dropdown menus */}
        {dropdownMenus.map((menu, index) => (
          <div key={index} className="block rounded-md text-base font-medium text-white">
            <button
              onClick={() => toggleSection(menu.label)}
              className="flex items-center justify-between w-full py-3 border-b border-blue-400 pb-2 focus:outline-none focus:ring-0"
            >
              <span className="text-lg">{menu.label}</span>
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
              <div className="pl-4 pt-3 pb-1 space-y-3">
                {menu.items.map((item, itemIndex) => (
                  <a
                    key={itemIndex}
                    href={item.href}
                    target={item.isExternal ? "_blank" : undefined}
                    rel={item.isExternal ? "noopener noreferrer" : undefined}
                    className="block py-2 text-white hover:text-amber-200 transition-colors duration-150"
                  >
                    {item.label}
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
            className="block py-4 text-lg font-medium text-white hover:text-amber-200 border-b border-blue-400 transition-colors duration-150"
          >
            {item.label}
          </a>
        ))}
      </div>
    </div>
  );
};

export default MobileNav;
