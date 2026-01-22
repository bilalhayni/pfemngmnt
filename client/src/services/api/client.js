import axios from 'axios';
import Cookies from 'js-cookie';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

/**
 * Axios client instance with authentication interceptors
 */
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

/**
 * Request interceptor - Add JWT token to all requests
 */
apiClient.interceptors.request.use(
  (config) => {
    const token = Cookies.get('auth');
    if (token && token !== 'true') {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Response interceptor - Handle authentication errors and token refresh
 */
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized (token expired or invalid)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const errorMessage = error.response?.data?.message || '';
      if (errorMessage.includes('Token expired')) {
        try {
          const response = await axios.post(`${API_BASE_URL}/refresh-token`, {}, {
            headers: {
              Authorization: `Bearer ${Cookies.get('auth')}`
            }
          });

          if (response.data.token) {
            Cookies.set('auth', response.data.token, { expires: 1 });
            originalRequest.headers.Authorization = `Bearer ${response.data.token}`;
            return apiClient(originalRequest);
          }
        } catch (refreshError) {
          // Refresh failed, redirect to login
        }
      }

      // Clear auth data and redirect to login
      clearAuthCookies();
      window.location.href = '/login';
    }

    // Handle 403 Forbidden (insufficient permissions)
    if (error.response?.status === 403) {
      console.error('Access denied:', error.response?.data?.message);
    }

    return Promise.reject(error);
  }
);

/**
 * Clear all authentication cookies
 */
export const clearAuthCookies = () => {
  Cookies.remove('auth');
  Cookies.remove('role');
  Cookies.remove('userId');
  Cookies.remove('filId');
};

export default apiClient;
