"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const NavLogo: React.FC = () => {
  return (
    <div className="flex items-center">
      <Link href="/" className="flex-shrink-0 flex items-center space-x-2">
        <div className="relative w-10 h-10 overflow-hidden rounded-full bg-white/10">
          <Image
            src="/images/members/logo.png"
            alt="Kingston Anash Logo"
            width={40}
            height={40}
            className="object-contain"
          />
        </div>
        <span className="text-xl font-bold text-white">Kingston Anash</span>
      </Link>
    </div>
  );
};

export default NavLogo;
