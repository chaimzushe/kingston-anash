"use client";

import React from 'react';
import Link from 'next/link';

const NavLogo: React.FC = () => {
  return (
    <div className="flex items-center">
      <Link href="/" className="flex-shrink-0 flex items-center">
        <span className="text-xl font-bold text-white">Kingston Anash</span>
      </Link>
    </div>
  );
};

export default NavLogo;
