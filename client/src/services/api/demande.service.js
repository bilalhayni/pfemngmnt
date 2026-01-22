import apiClient from './client';

/**
 * Demande (Request) service
 */
const demandeService = {
  getAll: () => apiClient.get('/demandes'),
  getByProfessor: (profId) => apiClient.get(`/demandes/prof/${profId}`),
  getByStudent: (studentId) => apiClient.get(`/demandes/student/${studentId}`),
  create: (data) => apiClient.post('/demandes', data),
  approve: (id) => apiClient.put(`/demandes/${id}/approve`),
  reject: (id) => apiClient.put(`/demandes/${id}/reject`),
  delete: (id) => apiClient.delete(`/demandes/${id}`)
};

/**
 * Postulation (Student application) service
 */
export const postulationService = {
  getByStudent: (studentId) => apiClient.get(`/postulations/student/${studentId}`),
  getByPfe: (pfeId) => apiClient.get(`/postulations/pfe/${pfeId}`),
  create: (data) => apiClient.post('/postulations', data),
  accept: (id) => apiClient.put(`/postulations/${id}/accept`),
  reject: (id) => apiClient.put(`/postulations/${id}/reject`),
  cancel: (id) => apiClient.delete(`/postulations/${id}`)
};

export default demandeService;
