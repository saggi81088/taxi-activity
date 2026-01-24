import axios from 'axios';
import { paths } from '@/paths';

// Use relative URLs to hit Next.js proxy routes instead of direct CI API
const axiosInstance = axios.create({
  baseURL: '/api',
});

// Request interceptor to add token to headers
axiosInstance.interceptors.request.use(
  (config) => {
    if (globalThis.window) {
      const token = localStorage.getItem('custom-auth-token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle 401 Unauthorized or 403 Forbidden (token expired/invalid)
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      // Check if we're in the browser and clear the expired token
      if (globalThis.window !== undefined) {
        localStorage.removeItem('custom-auth-token');
        
        // Only redirect if not already on sign-in page
        if (!globalThis.window.location.pathname.includes('/auth/sign-in')) {
          globalThis.window.location.href = paths.auth.signIn;
        }
      }
    } else {
      // For other errors, just reject
      return Promise.reject(error);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
