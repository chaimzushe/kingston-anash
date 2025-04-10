export interface Creator {
  id: string;
  name: string;
  email: string;
}

export interface Event {
  _id: string;
  title: string;
  date: string; // ISO date string
  startTime: string; // 24-hour format (HH:MM)
  endTime: string; // 24-hour format (HH:MM)
  location: string;
  description?: string;
  gender: 'men' | 'women' | 'both';
  creator?: Creator;
  createdAt: string;
}
