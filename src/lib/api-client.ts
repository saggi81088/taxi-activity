import axios from 'axios';

// Create axios instance for external API calls
const apiClient = axios.create({
  baseURL: 'https://gd.ayasglobe.com/api',
  timeout: 10_000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error?.response?.data || error?.message);
    return Promise.reject(error);
  }
);

export default apiClient;
