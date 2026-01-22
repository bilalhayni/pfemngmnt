import apiClient from './client';

/**
 * Admin service for administrative operations
 */
const adminService = {
  // Stats
  getStats: () => apiClient.get('/admin/stats'),

  // Students
  getPendingStudents: () => apiClient.get('/stdListe'),
  getActivatedStudents: () => apiClient.get('/stdListeAct'),
  activateStudent: (id) => apiClient.put('/validStd', { id }),
  blockStudent: (id) => apiClient.put('/blockStd', { id }),

  // Professors
  getAllProfessors: () => apiClient.get('/allProf'),

  // Chefs de Département
  getAllChefDepartements: () => apiClient.get('/allChefDep'),

  // User management
  createAccount: (data) => apiClient.post('/adminCreate', data),
  deleteUser: (id) => apiClient.delete(`/deleteUser/${id}`)
};

export default adminService;
