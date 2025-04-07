import { RideShare } from '@/types/rideShare';

// Helper function to create dates relative to today
const getRelativeDate = (dayOffset: number): string => {
  const date = new Date();
  date.setDate(date.getDate() + dayOffset);
  return date.toISOString().split('T')[0];
};

// Helper function to create posted dates (in the past)
const getPostedDate = (dayOffset: number): string => {
  const date = new Date();
  date.setDate(date.getDate() - dayOffset);
  return date.toISOString();
};

// Create dummy ride share data
export const dummyRideShares: RideShare[] = [
  {
    id: '1',
    driverName: 'Moshe Cohen',
    origin: 'Kingston',
    destination: 'Brooklyn, NY',
    departureDate: getRelativeDate(1), // Tomorrow
    departureTime: '08:00',
    returnDate: getRelativeDate(1), // Same day return
    returnTime: '18:00',
    availableSeats: 3,
    pricePerSeat: 20,
    contactPhone: '(845) 555-1234',
    contactEmail: 'moshe.c@example.com',
    notes: 'Leaving from Kingston Heights. Will make stops in Monsey if needed.',
    isRoundTrip: true,
    vehicleType: 'SUV',
    postedDate: getPostedDate(2)
  },
  {
    id: '2',
    driverName: 'Sarah Goldberg',
    origin: 'Kingston',
    destination: 'Monsey, NY',
    departureDate: getRelativeDate(2), // Day after tomorrow
    departureTime: '10:30',
    availableSeats: 2,
    pricePerSeat: 15,
    contactPhone: '(845) 555-5678',
    notes: 'Leaving from downtown Kingston. No stops along the way.',
    isRoundTrip: false,
    vehicleType: 'Sedan',
    postedDate: getPostedDate(1)
  },
  {
    id: '3',
    driverName: 'David Levy',
    origin: 'Kingston',
    destination: 'Manhattan, NY',
    departureDate: getRelativeDate(3),
    departureTime: '07:00',
    returnDate: getRelativeDate(3),
    returnTime: '20:00',
    availableSeats: 4,
    pricePerSeat: 25,
    contactEmail: 'david.l@example.com',
    notes: 'Leaving from Cedar Street. Will be dropping off in Midtown Manhattan.',
    isRoundTrip: true,
    vehicleType: 'Minivan',
    postedDate: getPostedDate(3)
  },
  {
    id: '4',
    driverName: 'Rachel Stern',
    origin: 'Kingston',
    destination: 'Lakewood, NJ',
    departureDate: getRelativeDate(5),
    departureTime: '14:00',
    returnDate: getRelativeDate(7),
    returnTime: '12:00',
    availableSeats: 2,
    pricePerSeat: 30,
    contactPhone: '(845) 555-9012',
    contactEmail: 'rachel.s@example.com',
    notes: 'Weekend trip. Leaving Friday afternoon, returning Sunday. Comfortable car with trunk space for luggage.',
    isRoundTrip: true,
    vehicleType: 'Sedan',
    postedDate: getPostedDate(4)
  },
  {
    id: '5',
    driverName: 'Yosef Katz',
    origin: 'Kingston',
    destination: 'Albany, NY',
    departureDate: getRelativeDate(1),
    departureTime: '09:15',
    availableSeats: 3,
    pricePerSeat: 10,
    contactPhone: '(845) 555-3456',
    notes: 'Quick trip to Albany for appointments. Will be back same day but not offering return rides.',
    isRoundTrip: false,
    vehicleType: 'Sedan',
    postedDate: getPostedDate(1)
  },
  {
    id: '6',
    driverName: 'Leah Friedman',
    origin: 'Kingston',
    destination: 'Monticello, NY',
    departureDate: getRelativeDate(2),
    departureTime: '11:30',
    returnDate: getRelativeDate(2),
    returnTime: '16:45',
    availableSeats: 1,
    pricePerSeat: 12,
    contactEmail: 'leah.f@example.com',
    notes: 'Going for a doctor\'s appointment. Only one seat available.',
    isRoundTrip: true,
    vehicleType: 'Compact',
    postedDate: getPostedDate(2)
  },
  {
    id: '7',
    driverName: 'Avi Rosenberg',
    origin: 'Kingston',
    destination: 'Poughkeepsie, NY',
    departureDate: getRelativeDate(1),
    departureTime: '16:00',
    availableSeats: 3,
    pricePerSeat: 5,
    contactPhone: '(845) 555-7890',
    notes: 'Going to Poughkeepsie for evening shopping. Will return around 9 PM but listing as one-way.',
    isRoundTrip: false,
    vehicleType: 'SUV',
    postedDate: getPostedDate(1)
  },
  {
    id: '8',
    driverName: 'Miriam Weiss',
    origin: 'Kingston',
    destination: 'New Paltz, NY',
    departureDate: getRelativeDate(4),
    departureTime: '13:00',
    returnDate: getRelativeDate(4),
    returnTime: '17:30',
    availableSeats: 2,
    pricePerSeat: 8,
    contactEmail: 'miriam.w@example.com',
    contactPhone: '(845) 555-2345',
    notes: 'Going to New Paltz for afternoon errands. Can drop off at SUNY New Paltz or in town.',
    isRoundTrip: true,
    vehicleType: 'Sedan',
    postedDate: getPostedDate(3)
  },
  {
    id: '9',
    driverName: 'Yaakov Shapiro',
    origin: 'Kingston',
    destination: 'Woodbourne, NY',
    departureDate: getRelativeDate(7),
    departureTime: '08:30',
    returnDate: getRelativeDate(7),
    returnTime: '19:00',
    availableSeats: 4,
    pricePerSeat: 15,
    contactPhone: '(845) 555-6789',
    notes: 'Day trip to visit family in Woodbourne. Spacious vehicle with room for packages.',
    isRoundTrip: true,
    vehicleType: 'SUV',
    postedDate: getPostedDate(5)
  },
  {
    id: '10',
    driverName: 'Chana Berkowitz',
    origin: 'Kingston',
    destination: 'Kiryas Joel, NY',
    departureDate: getRelativeDate(3),
    departureTime: '10:00',
    availableSeats: 2,
    pricePerSeat: 18,
    contactEmail: 'chana.b@example.com',
    notes: 'Going to KJ for a family simcha. One-way trip, but might be able to arrange return ride if needed.',
    isRoundTrip: false,
    vehicleType: 'Sedan',
    postedDate: getPostedDate(2)
  }
];

// Function to get upcoming rides (departure date is today or in the future)
export const getUpcomingRides = (): RideShare[] => {
  const today = new Date().toISOString().split('T')[0];
  return dummyRideShares.filter(ride => ride.departureDate >= today);
};

// Function to get a ride by ID
export const getRideById = (id: string): RideShare | undefined => {
  return dummyRideShares.find(ride => ride.id === id);
};
