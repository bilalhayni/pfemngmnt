import apiClient from './client';

/**
 * Chef Département service for department head operations
 */
const chefDepartementService = {
  // Stats
  getStats: (filiereId) => apiClient.get(`/stats/dashboard/${filiereId}`),
  getMyPfeStats: (userId) => apiClient.get(`/chefDepadv/${userId}`),
  getAllPfeStats: (filiereId) => apiClient.get(`/chefDepadvAll/${filiereId}`),

  // Professors
  getProfessors: (filiereId) => apiClient.get(`/prof/${filiereId}`),

  // Students
  getStudents: (filiereId) => apiClient.get(`/stdListe/${filiereId}`),

  // PFEs
  getMyPfes: (userId) => apiClient.get(`/myPfe/${userId}`),
  getAllPfes: (filiereId) => apiClient.get(`/allPfe/${filiereId}`),
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
  addDomain: (data) => apiClient.post('/addDomaine', data),
  addPrerequisite: (data) => apiClient.post('/addPrerequi', data),

  // Demandes (student requests to professors in filiere)
  getStudentRequests: (userId) => apiClient.get(`/demandes/${userId}`),
  acceptRequest: (id) => apiClient.put('/affectPfe', { id }),
  rejectRequest: (id) => apiClient.delete(`/deleteDemande/${id}`),

  // Students assigned to PFEs
  getAssignedStudents: (userId) => apiClient.get(`/stdPfe/${userId}`)
};

export default chefDepartementService;
