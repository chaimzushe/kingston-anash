"use client";

import React, { useState } from 'react';
import NavLogo from './NavLogo';
import DesktopNav from './DesktopNav';
import MobileNav from './MobileNav';
import MobileMenuButton from './MobileMenuButton';

const Navigation: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="bg-gradient-primary text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <NavLogo />
          <DesktopNav />
          <MobileMenuButton isOpen={isMobileMenuOpen} onClick={toggleMobileMenu} />
        </div>
      </div>

      <MobileNav isOpen={isMobileMenuOpen} />
    </nav>
  );
};

export default Navigation;
