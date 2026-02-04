'use client';

import { useEffect } from 'react';
import { setupTokenRefreshInterval } from '@/lib/authClient';

/**
 * Client component that sets up proactive token refresh
 * Should be placed near the root of your app
 */
export default function TokenRefreshProvider() {
  useEffect(() => {
    const cleanup = setupTokenRefreshInterval();
    return cleanup;
  }, []);

  return null;
}
