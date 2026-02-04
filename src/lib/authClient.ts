import axios from 'axios';

export function getAccessToken() {
  return typeof window !== "undefined"
    ? localStorage.getItem("accessToken")
    : null;
}

export function clearAuth() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
}

/**
 * Decode JWT without verification (client-side only)
 * Used to check token expiration time
 */
export function decodeToken(token: string) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Failed to decode token:', error);
    return null;
  }
}

/**
 * Check if token is expiring soon (within 2 minutes)
 */
export function isTokenExpiringSoon(token: string): boolean {
  const decoded = decodeToken(token);
  if (!decoded?.exp) return false;

  const expiresAt = decoded.exp * 1000; // Convert to milliseconds
  const now = Date.now();
  const timeUntilExpiry = expiresAt - now;

  // Return true if token expires within 2 minutes
  return timeUntilExpiry < 2 * 60 * 1000;
}

/**
 * Refresh access token proactively
 */
export async function refreshAccessToken(): Promise<string | null> {
  try {
    const response = await axios.post(
      '/api/auth/refresh',
      {},
      { withCredentials: true }
    );

    const newAccessToken = response.data.accessToken;
    if (newAccessToken) {
      localStorage.setItem('accessToken', newAccessToken);
      return newAccessToken;
    }
    return null;
  } catch (error) {
    console.error('Token refresh failed:', error);
    // Clear auth and redirect to login
    clearAuth();
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
    return null;
  }
}

/**
 * Setup proactive token refresh interval
 */
export function setupTokenRefreshInterval() {
  if (typeof window === 'undefined') return;

  const interval = setInterval(() => {
    const token = getAccessToken();
    if (token && isTokenExpiringSoon(token)) {
      refreshAccessToken();
    }
  }, 30000); // Check every 30 seconds

  // Cleanup on unload
  const cleanup = () => clearInterval(interval);
  window.addEventListener('beforeunload', cleanup);

  return cleanup;
}

