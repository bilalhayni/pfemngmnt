import apiClient from './client';

/**
 * Domain service
 */
const domainService = {
  getAll: () => apiClient.get('/domaines'),
  getById: (id) => apiClient.get(`/domaines/${id}`),
  create: (data) => apiClient.post('/domaines', data),
  update: (id, data) => apiClient.put(`/domaines/${id}`, data),
  delete: (id) => apiClient.delete(`/domaines/${id}`)
};

/**
 * Prerequisite service
 */
export const prerequisiteService = {
  getAll: () => apiClient.get('/prerequis'),
  getByFiliere: (filiereId) => apiClient.get(`/prerequis/filiere/${filiereId}`),
  create: (data) => apiClient.post('/prerequis', data),
  update: (id, data) => apiClient.put(`/prerequis/${id}`, data),
  delete: (id) => apiClient.delete(`/prerequis/${id}`)
};

export default domainService;
