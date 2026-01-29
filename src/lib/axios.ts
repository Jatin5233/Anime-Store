import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // ✅ Essential for httpOnly cookies
});

/* ================= REQUEST INTERCEPTOR ================= */
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("accessToken");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

/* ================= RESPONSE INTERCEPTOR ================= */
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Don't retry refresh endpoint itself
    if (originalRequest.url?.includes('/auth/refresh')) {
      return Promise.reject(error);
    }

    // If unauthorized & not already retried
    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      // If refresh already in progress, queue this request
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      isRefreshing = true;

      try {
        // ✅ Call refresh endpoint - server reads httpOnly cookie
        const res = await axios.post(
          "/api/auth/refresh",
          {},
          { withCredentials: true }
        );

        const newAccessToken = res.data.accessToken;

        if (!newAccessToken) {
          throw new Error("No access token in refresh response");
        }

        // ✅ Save new access token
        localStorage.setItem("accessToken", newAccessToken);

        // ✅ Update default headers
        api.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;

        // ✅ Process queued requests with new token
        processQueue(null, newAccessToken);

        // ✅ Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // ✅ Process queue with error
        processQueue(refreshError, null);

        // ✅ Only clear localStorage, not httpOnly cookie
        // The cookie will be cleared by the logout endpoint
        localStorage.removeItem("accessToken");
        
        // ❌ DON'T try to remove refreshToken from localStorage
        // It's in an httpOnly cookie and can't be accessed from JS

        // Optional: Call logout endpoint to clear httpOnly cookie
        try {
          await axios.post("/api/auth/logout", {}, { withCredentials: true });
        } catch (logoutError) {
          console.error("Logout error:", logoutError);
        }

        // ✅ Redirect to login
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // For other errors, just reject
    return Promise.reject(error);
  }
);

export default api;