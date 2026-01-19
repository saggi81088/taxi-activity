import axios from 'axios';

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
    // Don't automatically redirect on 401 here - let components handle it
    return Promise.reject(error);
  }
);

export default axiosInstance;
