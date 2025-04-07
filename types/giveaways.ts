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
  imageUrl?: string;
  postedDate: string; // ISO date string
  isAvailable: boolean;
  tags?: string[];
}
