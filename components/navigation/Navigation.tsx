"use client";

import React, { useState } from 'react';
import NavLogo from './NavLogo';
import DesktopNav from './DesktopNav';
import MobileNav from './MobileNav';
import MobileMenuButton from './MobileMenuButton';
import AuthNav from './AuthNav';

const Navigation: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="bg-gradient-primary text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <NavLogo />
          <div className="hidden md:flex md:items-center md:space-x-8">
            <DesktopNav />
            <AuthNav />
          </div>
          <MobileMenuButton isOpen={isMobileMenuOpen} onClick={toggleMobileMenu} />
        </div>
      </div>

      <MobileNav isOpen={isMobileMenuOpen} />
    </nav>
  );
};

export default Navigation;
