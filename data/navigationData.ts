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
      { label: 'Bais moshe', href: '/minyanim/bm' },
      { label: 'Cheder sheni', href: '/minyanim/cheder-sheni' },
      { label: 'Deli Minyan', href: '/minyanim/deli-minyan' },
      { label: 'Bais Tzvi Yosef', href: '/minyanim/bty' }
    ]
  }
];
