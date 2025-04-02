"use client";

import React from 'react';
import NavLink from './NavLink';
import DropdownMenu from './DropdownMenu';
import { mainNavItems, dropdownMenus } from '../../data/navigationData';

const DesktopNav: React.FC = () => {
  return (
    <div className="hidden md:flex md:items-center md:space-x-6">
      {/* Render dropdown menus */}
      {dropdownMenus.map((menu, index) => (
        <DropdownMenu key={index} label={menu.label} items={menu.items} />
      ))}

      {/* Render regular nav links */}
      {mainNavItems.map((item, index) => (
        <NavLink key={index} href={item.href}>
          {item.label}
        </NavLink>
      ))}
    </div>
  );
};

export default DesktopNav;
