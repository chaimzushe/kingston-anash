import { Event } from '@/types/events';

// Helper function to create dates relative to today
const getRelativeDate = (dayOffset: number): string => {
  const date = new Date();
  date.setDate(date.getDate() + dayOffset);
  return date.toISOString().split('T')[0];
};

// Create dummy events data
export const dummyEvents: Event[] = [
  // Today's events
  {
    id: '1',
    title: 'Morning Minyan',
    date: getRelativeDate(0),
    startTime: '07:30',
    endTime: '08:30',
    location: 'Main Synagogue',
    description: 'Daily morning prayer service',
    tags: ['Prayer', 'Daily']
  },
  {
    id: '2',
    title: 'Torah Study Group',
    date: getRelativeDate(0),
    startTime: '10:00',
    endTime: '11:30',
    location: 'Community Center',
    description: 'Weekly Torah portion study with Rabbi Goldstein',
    attendees: 15,
    tags: ['Learning', 'Weekly']
  },
  {
    id: '3',
    title: 'Evening Minyan',
    date: getRelativeDate(0),
    startTime: '19:00',
    endTime: '19:45',
    location: 'Main Synagogue',
    description: 'Daily evening prayer service',
    tags: ['Prayer', 'Daily']
  },

  // Tomorrow's events
  {
    id: '4',
    title: 'Morning Minyan',
    date: getRelativeDate(1),
    startTime: '07:30',
    endTime: '08:30',
    location: 'Main Synagogue',
    description: 'Daily morning prayer service',
    tags: ['Prayer', 'Daily']
  },
  {
    id: '5',
    title: 'Women\'s Circle',
    date: getRelativeDate(1),
    startTime: '11:00',
    endTime: '12:30',
    location: 'Community Center',
    description: 'Monthly women\'s discussion group',
    attendees: 22,
    tags: ['Community', 'Monthly']
  },
  {
    id: '6',
    title: 'Evening Minyan',
    date: getRelativeDate(1),
    startTime: '19:00',
    endTime: '19:45',
    location: 'Main Synagogue',
    description: 'Daily evening prayer service',
    tags: ['Prayer', 'Daily']
  },

  // Day after tomorrow
  {
    id: '7',
    title: 'Morning Minyan',
    date: getRelativeDate(2),
    startTime: '07:30',
    endTime: '08:30',
    location: 'Main Synagogue',
    description: 'Daily morning prayer service',
    tags: ['Prayer', 'Daily']
  },
  {
    id: '8',
    title: 'Community Lunch',
    date: getRelativeDate(2),
    startTime: '12:00',
    endTime: '14:00',
    location: 'Community Hall',
    description: 'Monthly community lunch with special guest speaker',
    attendees: 50,
    tags: ['Community', 'Food', 'Monthly']
  },
  {
    id: '9',
    title: 'Youth Group',
    date: getRelativeDate(2),
    startTime: '16:00',
    endTime: '17:30',
    location: 'Youth Center',
    description: 'Weekly activities for children ages 8-13',
    attendees: 18,
    tags: ['Youth', 'Weekly']
  },
  {
    id: '10',
    title: 'Evening Minyan',
    date: getRelativeDate(2),
    startTime: '19:00',
    endTime: '19:45',
    location: 'Main Synagogue',
    description: 'Daily evening prayer service',
    tags: ['Prayer', 'Daily']
  },

  // Next week
  {
    id: '11',
    title: 'Shabbat Service',
    date: getRelativeDate(5),
    startTime: '09:30',
    endTime: '12:30',
    location: 'Main Synagogue',
    description: 'Shabbat morning service followed by kiddush',
    attendees: 75,
    tags: ['Prayer', 'Shabbat', 'Weekly']
  },
  {
    id: '12',
    title: 'Havdalah and Movie Night',
    date: getRelativeDate(6),
    startTime: '20:00',
    endTime: '22:30',
    location: 'Community Center',
    description: 'Havdalah ceremony followed by a community movie night',
    attendees: 40,
    tags: ['Community', 'Social', 'Monthly']
  },
  {
    id: '13',
    title: 'Board Meeting',
    date: getRelativeDate(7),
    startTime: '19:30',
    endTime: '21:00',
    location: 'Conference Room',
    description: 'Monthly board meeting to discuss community matters',
    attendees: 12,
    tags: ['Administrative', 'Monthly']
  },
  {
    id: '14',
    title: 'Challah Baking Workshop',
    date: getRelativeDate(8),
    startTime: '16:00',
    endTime: '18:00',
    location: 'Community Kitchen',
    description: 'Learn to bake traditional challah bread',
    attendees: 20,
    tags: ['Workshop', 'Food', 'Monthly']
  },
  {
    id: '15',
    title: 'Charity Committee',
    date: getRelativeDate(9),
    startTime: '18:30',
    endTime: '19:30',
    location: 'Small Meeting Room',
    description: 'Monthly meeting to discuss charitable initiatives',
    attendees: 8,
    tags: ['Committee', 'Charity', 'Monthly']
  }
];

// Function to get events for a specific date
export const getEventsForDate = (date: Date): Event[] => {
  const dateString = date.toISOString().split('T')[0];
  return dummyEvents.filter(event => event.date === dateString);
};

// Function to get all events
export const getAllEvents = (): Event[] => {
  return dummyEvents;
};
