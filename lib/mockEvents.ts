// Mock events storage for development
import { Event } from '@/types/events';

// Storage key for localStorage
const STORAGE_KEY = 'mockEvents';

// Get events from storage
function getEventsFromStorage(): Event[] {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const storedEvents = localStorage.getItem(STORAGE_KEY);
    return storedEvents ? JSON.parse(storedEvents) : [];
  } catch (error) {
    console.error('Error reading mock events from storage:', error);
    return [];
  }
}

// Save events to storage
function saveEventsToStorage(events: Event[]): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
  } catch (error) {
    console.error('Error saving mock events to storage:', error);
  }
}

// Add a mock event
export function addMockEvent(event: Event): Event {
  const events = getEventsFromStorage();
  events.push(event);
  saveEventsToStorage(events);
  return event;
}

// Get all mock events
export function getMockEvents(): Event[] {
  return getEventsFromStorage();
}

// Get mock events by date
export function getMockEventsByDate(date: string): Event[] {
  const events = getEventsFromStorage();
  return events.filter(event => event.date === date);
}

// Clear all mock events (for testing)
export function clearMockEvents(): void {
  saveEventsToStorage([]);
}
