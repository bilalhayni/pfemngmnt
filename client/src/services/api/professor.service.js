import apiClient from './client';

/**
 * Professor service for basic CRUD operations
 */
const professorService = {
  getAll: () => apiClient.get('/professeurs'),
  getById: (id) => apiClient.get(`/professeurs/${id}`),
  create: (data) => apiClient.post('/professeurs', data),
  update: (id, data) => apiClient.put(`/professeurs/${id}`, data),
  delete: (id) => apiClient.delete(`/professeurs/${id}`)
};

/**
 * Professor Portal service for professor-specific operations
 */
export const professorPortalService = {
  // Stats
  getStats: (userId) => apiClient.get(`/professor/stats?userId=${userId}`),

  // Profile
  getProfile: (id) => apiClient.get(`/profile/${id}`),
  updateProfile: (data) => apiClient.put('/updateProfile', data),

  // PFEs
  getMyPfes: (userId) => apiClient.get(`/myPfe/${userId}`),
  getPfeDetails: (id) => apiClient.get(`/SinglePfe/${id}`),
  getPfePrerequisites: (id) => apiClient.get(`/prerequisPfe/${id}`),
  createPfe: (data) => apiClient.post('/newPfe', data),
  updatePfe: (data) => apiClient.put('/updatePfe', data),
  deletePfe: (id) => apiClient.delete(`/deletePfe/${id}`),
  updatePfeProgress: (id, avancement) => apiClient.put('/updateavan', { id, avancement }),
  setDefenseDate: (id, date) => apiClient.put('/updateDateSout', { id, date }),

  // Domains & Prerequisites
  getDomains: (filiereId) => apiClient.get(`/domaineFil/${filiereId}`),
  getPrerequisites: (filiereId) => apiClient.get(`/prerequisFil/${filiereId}`),

  // Student Requests
  getStudentRequests: (userId) => apiClient.get(`/demandes/${userId}`),
  acceptRequest: (id) => apiClient.put('/affectPfe', { id }),
  rejectRequest: (id) => apiClient.delete(`/deleteDemande/${id}`),

  // My Students
  getMyStudents: (userId) => apiClient.get(`/stdPfe/${userId}`)
};

export default professorService;
