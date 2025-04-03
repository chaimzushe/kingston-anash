export interface NavItem {
  label: string;
  href: string;
  isExternal?: boolean;
}

export interface DropdownItem {
  label: string;
  items: NavItem[];
}

// Main navigation items
export const mainNavItems: NavItem[] = [
  { label: 'Community', href: '#' },
  { label: 'Events', href: '#' },
];

// Dropdown menu items
export const dropdownMenus: DropdownItem[] = [
  {
    label: 'Minyanim',
    items: [
      { label: '770 Eastern Parkway', href: '/minyanim/770' },
      { label: 'Kingston Avenue Shul', href: '/minyanim/kingston-avenue-shul' },
      { label: 'Beis Rivkah', href: '/minyanim/beis-rivkah' },
      { label: 'Oholei Torah', href: '/minyanim/oholei-torah' }
    ]
  }
];
