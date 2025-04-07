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
  { label: 'Subscribe', href: '/subscribe' },
];

// Dropdown menu items
export const dropdownMenus: DropdownItem[] = [
  {
    label: 'Community',
    items: [
      { label: 'Directory', href: '/community' },
      { label: 'Events', href: '/community/events' },
      { label: 'Giveaways', href: '/community/giveaways' },
      { label: 'Ride Share', href: '/community/ride-share' },
      { label: 'Lashon Hara Chat', href: '/community/lashon-hara' }
    ]
  },
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
