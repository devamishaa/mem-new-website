import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "https://api.memorae.ai",
});

// Request interceptor to add timezone and auth
api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      // Add timezone to POST requests automatically
      if (
        config.method === "post" &&
        config.data &&
        typeof config.data === "object" &&
        !config.data.timezone
      ) {
        config.data = {
          ...config.data,
          timezone,
        };
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      typeof window !== "undefined" &&
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      // Clear auth data
      localStorage.removeItem("token");
      document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";

      // Could redirect to login or show message
      console.warn("Authentication expired");
    }

    return Promise.reject(error);
  }
);

// Pricing API methods
export const pricingApi = {
  // Fetch all packages with timezone-based pricing
  async fetchPackages(timezone = null) {
    try {
      const tz = timezone || Intl.DateTimeFormat().resolvedOptions().timeZone;
      const response = await api.get(
        `/all-package?timezone=${encodeURIComponent(tz)}`
      );
      return response.data;
    } catch (error) {
      console.error("Failed to fetch packages:", error);

      // Return error structure when API fails
      return {
        error: true,
        message: error.message || "Unable to connect to pricing service",
        data: [],
      };
    }
  },

  // Fetch current user subscription
  async fetchCurrentSubscription() {
    try {
      const response = await api.get("/getLatestSubscription");
      return response.data;
    } catch (error) {
      console.error("Failed to fetch subscription:", error);

      // Return error structure for graceful handling
      return {
        error: true,
        message:
          error.response?.status === 401
            ? "User not authenticated"
            : "Failed to fetch subscription",
        data: null,
      };
    }
  },

  // Create Stripe checkout session
  async createCheckoutSession(data) {
    try {
      const response = await api.post("/checkout-session-stripe", data);
      return response.data;
    } catch (error) {
      console.error("Failed to create checkout session:", error);
      throw error;
    }
  },

  // Update subscription
  async updateSubscription(data) {
    try {
      const response = await api.post("/update-subscription", data);
      return response.data;
    } catch (error) {
      console.error("Failed to update subscription:", error);
      throw error;
    }
  },
};

export default api;
