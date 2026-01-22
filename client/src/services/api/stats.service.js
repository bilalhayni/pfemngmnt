import apiClient from './client';

/**
 * Dashboard Statistics service
 */
const statsService = {
  getDashboard: () => apiClient.get('/stats/dashboard'),
  getPfeStats: () => apiClient.get('/stats/pfe'),
  getStudentStats: () => apiClient.get('/stats/students'),
  getProfessorStats: () => apiClient.get('/stats/professors')
};

export default statsService;
