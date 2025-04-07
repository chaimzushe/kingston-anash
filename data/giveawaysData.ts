import { Giveaway } from '@/types/giveaways';

// Helper function to create dates relative to today
const getRelativeDate = (dayOffset: number): string => {
  const date = new Date();
  date.setDate(date.getDate() - dayOffset); // Negative to make it in the past
  return date.toISOString();
};

// Create dummy marketplace data (both free and for sale items)
export const dummyGiveaways: Giveaway[] = [
  {
    id: '1',
    title: 'Baby Crib with Mattress',
    description: 'Wooden baby crib in good condition. Includes mattress and two fitted sheets. No longer needed as our child has outgrown it.',
    condition: 'Good',
    category: 'Baby & Kids',
    location: 'Kingston Heights',
    contactName: 'Sarah Goldstein',
    contactEmail: 'sarah.g@example.com',
    contactPhone: '(845) 555-1234',
    imageUrl: 'https://images.unsplash.com/photo-1586683086816-c0d0fda82e7f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    postedDate: getRelativeDate(2),
    isAvailable: true,
    tags: ['Furniture', 'Baby', 'Bedroom'],
    price: 0, // Free item
    isFree: true
  },
  {
    id: '2',
    title: 'Men\'s Winter Coat Size L',
    description: 'Black winter coat, size large. Very warm, only worn for one season. Giving away because I received a new one as a gift.',
    condition: 'Like New',
    category: 'Clothing',
    location: 'Downtown Kingston',
    contactName: 'David Levy',
    contactPhone: '(845) 555-5678',
    postedDate: getRelativeDate(5),
    isAvailable: true,
    tags: ['Clothing', 'Men', 'Winter'],
    price: 25, // $25
    isFree: false
  },
  {
    id: '3',
    title: 'Kitchen Table with 4 Chairs',
    description: 'Wooden kitchen table with four matching chairs. Table is 48" x 30". Some minor scratches but overall in good condition.',
    condition: 'Good',
    category: 'Furniture',
    location: 'Maple Ridge',
    contactName: 'Rachel Cohen',
    contactEmail: 'rachel.c@example.com',
    imageUrl: 'https://images.unsplash.com/photo-1530018607912-eff2daa1bac4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    postedDate: getRelativeDate(7),
    isAvailable: true,
    tags: ['Furniture', 'Kitchen', 'Dining'],
    price: 75, // $75
    isFree: false
  },
  {
    id: '4',
    title: 'Children\'s Books Collection',
    description: 'Collection of 15 children\'s books in excellent condition. Suitable for ages 3-8. Titles include popular Jewish stories and educational books.',
    condition: 'Like New',
    category: 'Books & Media',
    location: 'Kingston Heights',
    contactName: 'Miriam Shapiro',
    contactEmail: 'miriam.s@example.com',
    contactPhone: '(845) 555-9012',
    imageUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    postedDate: getRelativeDate(10),
    isAvailable: true,
    tags: ['Books', 'Children', 'Education'],
    price: 0, // Free item
    isFree: true
  },
  {
    id: '5',
    title: 'Stroller',
    description: 'Gently used stroller in good working condition. Folds easily for storage and has storage basket underneath.',
    condition: 'Good',
    category: 'Baby & Kids',
    location: 'Cedar Street',
    contactName: 'Yosef Katz',
    contactPhone: '(845) 555-3456',
    postedDate: getRelativeDate(12),
    isAvailable: false, // Already taken
    tags: ['Baby', 'Outdoor'],
    price: 0, // Free item
    isFree: true
  },
  {
    id: '6',
    title: 'Desk Lamp',
    description: 'Black desk lamp with adjustable arm. Works perfectly, just upgraded to a new one.',
    condition: 'Good',
    category: 'Home Goods',
    location: 'Downtown Kingston',
    contactName: 'Avi Stern',
    contactEmail: 'avi.s@example.com',
    postedDate: getRelativeDate(3),
    isAvailable: true,
    tags: ['Electronics', 'Office', 'Lighting'],
    price: 10, // $10
    isFree: false
  },
  {
    id: '7',
    title: 'Women\'s Shabbat Clothes Size M',
    description: 'Three Shabbat outfits, size medium. All in excellent condition and modest. Colors are navy, black, and burgundy.',
    condition: 'Like New',
    category: 'Clothing',
    location: 'Maple Ridge',
    contactName: 'Leah Friedman',
    contactEmail: 'leah.f@example.com',
    contactPhone: '(845) 555-7890',
    postedDate: getRelativeDate(4),
    isAvailable: true,
    tags: ['Clothing', 'Women', 'Shabbat'],
    price: 50, // $50
    isFree: false
  },
  {
    id: '8',
    title: 'Microwave Oven',
    description: 'Working microwave oven, 1000W. Approximately 5 years old but works well. Dimensions: 20" x 12" x 16".',
    condition: 'Fair',
    category: 'Appliances',
    location: 'Kingston Heights',
    contactName: 'Moshe Greenberg',
    contactPhone: '(845) 555-2345',
    imageUrl: 'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    postedDate: getRelativeDate(8),
    isAvailable: true,
    tags: ['Appliances', 'Kitchen', 'Electronics'],
    price: 0, // Free item
    isFree: true
  },
  {
    id: '9',
    title: 'Boys\' Bicycle (Ages 8-12)',
    description: 'Blue boys\' bicycle suitable for ages 8-12. 20-inch wheels, hand brakes. Some scratches but rides well.',
    condition: 'Good',
    category: 'Sports & Outdoors',
    location: 'Cedar Street',
    contactName: 'Daniel Rosen',
    contactEmail: 'daniel.r@example.com',
    imageUrl: 'https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    postedDate: getRelativeDate(6),
    isAvailable: true,
    tags: ['Sports', 'Children', 'Outdoor'],
    price: 30, // $30
    isFree: false
  },
  {
    id: '10',
    title: 'Bookshelf',
    description: 'Wooden bookshelf with 4 shelves. Brown color, 36" wide x 12" deep x 48" tall. Must pick up yourself.',
    condition: 'Good',
    category: 'Furniture',
    location: 'Downtown Kingston',
    contactName: 'Yaakov Weiss',
    contactPhone: '(845) 555-6789',
    imageUrl: 'https://images.unsplash.com/photo-1594620302200-9a762244a156?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    postedDate: getRelativeDate(9),
    isAvailable: true,
    tags: ['Furniture', 'Home', 'Storage'],
    price: 0, // Free item
    isFree: true
  }
];

// Function to get all available items
export const getAvailableGiveaways = (): Giveaway[] => {
  return dummyGiveaways.filter(giveaway => giveaway.isAvailable);
};

// Function to get only free items
export const getFreeItems = (): Giveaway[] => {
  return dummyGiveaways.filter(giveaway => giveaway.isAvailable && giveaway.isFree);
};

// Function to get only items for sale
export const getItemsForSale = (): Giveaway[] => {
  return dummyGiveaways.filter(giveaway => giveaway.isAvailable && giveaway.price && giveaway.price > 0);
};

// Function to get a giveaway by ID
export const getGiveawayById = (id: string): Giveaway | undefined => {
  return dummyGiveaways.find(giveaway => giveaway.id === id);
};
