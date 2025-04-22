export interface Giveaway {
  id: string;
  title: string;
  description: string;
  condition: 'New' | 'Like New' | 'Good' | 'Fair' | 'Poor';
  category: string;
  location: string;
  contactName: string;
  contactEmail?: string;
  contactPhone?: string;
  imageUrl?: string; // Main image (for backward compatibility)
  images?: string[]; // Array of image URLs (max 3)
  postedDate: string; // ISO date string
  isAvailable: boolean;
  price?: number; // Optional price in dollars
  isFree: boolean; // Whether the item is free
  tags?: string[];
}
