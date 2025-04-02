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
      { label: 'Bais Moshe', href: '#' },
      { label: 'Cheder Sheni', href: '#' },
      { label: 'Beis Tzvi Yosef', href: '#' },

    ]
  }
];
