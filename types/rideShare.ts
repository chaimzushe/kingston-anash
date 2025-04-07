export interface RideShare {
  id: string;
  driverName: string;
  origin: string;
  destination: string;
  departureDate: string; // ISO date string
  departureTime: string; // 24-hour format (HH:MM)
  returnDate?: string; // ISO date string
  returnTime?: string; // 24-hour format (HH:MM)
  availableSeats: number;
  pricePerSeat: number; // In dollars
  contactPhone?: string;
  contactEmail?: string;
  notes?: string;
  isRoundTrip: boolean;
  vehicleType?: string;
  postedDate: string; // ISO date string
}
