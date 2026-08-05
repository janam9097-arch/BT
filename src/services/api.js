import axios from "axios";
import supabase from "./supabaseClient";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor to add Supabase JWT Bearer token to every request
api.interceptors.request.use(
  async (config) => {
    try {
      const { data } = await supabase.auth.getSession();
      const token = data?.session?.access_token;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (e) {
      console.warn("Failed to get Supabase session for API request:", e);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — Supabase handles token refresh automatically,
// so we only need to handle 401s by redirecting to login
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      // Check if user's session is actually expired
      const { data } = await supabase.auth.getSession();
      if (!data?.session) {
        // Session is gone, redirect to login
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
