import apiClient from './client';

/**
 * Filiere (Department/Program) service
 */
const filiereService = {
  getAll: () => apiClient.get('/filiere'),
  getById: (id) => apiClient.get(`/filiere/${id}`),
  create: (data) => apiClient.post('/filiere', data),
  update: (id, data) => apiClient.put(`/filiere/${id}`, data),
  delete: (id) => apiClient.delete(`/filiere/${id}`)
};

export default filiereService;
