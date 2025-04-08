import { redirect } from 'next/navigation';

// Add this route to the protected routes in middleware.ts
export default function EventsRedirect() {
  // This will redirect to the community events page
  // The middleware will handle authentication checks
  redirect('/community/events');
}
