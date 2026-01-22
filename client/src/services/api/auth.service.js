import apiClient from './client';

/**
 * Authentication service for JWT operations
 */
const authService = {
  login: (email, password) => apiClient.post('/login', { email, password }),
  logout: () => apiClient.post('/logout'),
  verifyToken: () => apiClient.get('/verify-token'),
  refreshToken: () => apiClient.post('/refresh-token'),
  register: (data) => apiClient.post('/registerStudent', data),
  resetPassword: (email) => apiClient.post('/reset-password-email', { email })
};

export default authService;
