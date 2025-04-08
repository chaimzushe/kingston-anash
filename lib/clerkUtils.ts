import { UserResource } from '@clerk/types';
import LogRocket from './logrocket';

export function identifyClerkUser(user: UserResource | null) {
  if (typeof window !== 'undefined' && user) {
    // Get user name with fallbacks to ensure it's never null
    const firstName = user.firstName || '';
    const lastName = user.lastName || '';
    const username = user.username || '';
    const displayName = firstName ? `${firstName} ${lastName}`.trim() : username || 'Anonymous User';

    // Get email with fallback
    const email = user.emailAddresses[0]?.emailAddress || '';

    LogRocket.identify(user.id, {
      name: displayName,
      email: email,
    });
  }
}
