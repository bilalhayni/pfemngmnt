import apiClient from './client';

/**
 * Student service for CRUD and portal operations
 */
const studentService = {
  // Basic CRUD
  getAll: () => apiClient.get('/etudiants'),
  getById: (id) => apiClient.get(`/etudiants/${id}`),
  getActivated: () => apiClient.get('/etudiants/activated'),
  getPending: () => apiClient.get('/etudiants/pending'),
  create: (data) => apiClient.post('/registerStudent', data),
  update: (id, data) => apiClient.put(`/etudiants/${id}`, data),
  delete: (id) => apiClient.delete(`/etudiants/${id}`),
  activate: (id) => apiClient.put(`/etudiants/${id}/activate`),
  deactivate: (id) => apiClient.put(`/etudiants/${id}/deactivate`),

  // Student portal specific
  getStats: () => apiClient.get('/student/stats'),
  getProfile: (id) => apiClient.get(`/profileStd/${id}`),
  updateProfile: (data) => apiClient.put('/updateProfile', data),
  getAllPfes: (filiereId) => apiClient.get(`/allPfeStd/${filiereId}`),
  getPfeDetails: (id) => apiClient.get(`/SinglePfe/${id}`),
  getPfePrerequisites: (id) => apiClient.get(`/prerequisPfe/${id}`),
  getMyApplications: (userId) => apiClient.get(`/pfeOfStd/${userId}`),
  getMyPfe: (userId) => apiClient.get(`/MypfeOfStd/${userId}`),
  applyToPfe: (data) => apiClient.post('/addDemande', data),
  cancelApplication: (id) => apiClient.delete(`/deleteDemande/${id}`)
};

export default studentService;
