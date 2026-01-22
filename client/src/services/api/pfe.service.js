import apiClient from './client';

/**
 * PFE (Projet de Fin d'Études) service
 */
const pfeService = {
  getAll: () => apiClient.get('/pfe'),
  getById: (id) => apiClient.get(`/pfe/${id}`),
  getByProfessor: (profId) => apiClient.get(`/pfe/prof/${profId}`),
  getByStudent: (studentId) => apiClient.get(`/pfe/student/${studentId}`),
  create: (data) => apiClient.post('/pfe', data),
  update: (id, data) => apiClient.put(`/pfe/${id}`, data),
  delete: (id) => apiClient.delete(`/pfe/${id}`),
  assignStudent: (pfeId, studentId) => apiClient.post(`/pfe/${pfeId}/assign`, { studentId }),
  updateProgress: (pfeId, progress) => apiClient.put(`/pfe/${pfeId}/progress`, { progress })
};

export default pfeService;
