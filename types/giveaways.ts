export interface Giveaway {
  id: string;
  _id?: string; // Sanity ID
  title: string;
  description: string;
  condition?: 'New' | 'Like New' | 'Good' | 'Fair' | 'Poor';
  category?: string;
  location: string;
  contactName: string;
  contactEmail?: string;
  contactPhone?: string;
  imageUrl?: string; // Main image (for backward compatibility)
  images?: any[]; // Array of image objects (max 3)
  postedDate: string; // ISO date string
  isAvailable: boolean;
  price?: number; // Optional price in dollars
  isFree: boolean; // Whether the item is free
  tags?: string[];
  userId?: string; // ID of the user who created the giveaway
  userEmail?: string; // Email of the user who created the giveaway
}
