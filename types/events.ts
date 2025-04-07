export interface Event {
  id: string;
  title: string;
  date: string; // ISO date string
  startTime: string; // 24-hour format (HH:MM)
  endTime: string; // 24-hour format (HH:MM)
  location: string;
  description?: string;
  attendees?: number;
  tags?: string[];
  organizer?: string;
  imageUrl?: string;
}
