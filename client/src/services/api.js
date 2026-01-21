import axios from 'axios';
import Cookies from 'js-cookie';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get('auth');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      Cookies.remove('auth');
      Cookies.remove('role');
      Cookies.remove('userId');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// PFE Services
export const pfeService = {
  getAll: () => api.get('/pfe'),
  getById: (id) => api.get(`/pfe/${id}`),
  getByProfessor: (profId) => api.get(`/pfe/prof/${profId}`),
  getByStudent: (studentId) => api.get(`/pfe/student/${studentId}`),
  create: (data) => api.post('/pfe', data),
  update: (id, data) => api.put(`/pfe/${id}`, data),
  delete: (id) => api.delete(`/pfe/${id}`),
  assignStudent: (pfeId, studentId) => api.post(`/pfe/${pfeId}/assign`, { studentId }),
  updateProgress: (pfeId, progress) => api.put(`/pfe/${pfeId}/progress`, { progress })
};

// Professor Services
export const professorService = {
  getAll: () => api.get('/professeurs'),
  getById: (id) => api.get(`/professeurs/${id}`),
  create: (data) => api.post('/professeurs', data),
  update: (id, data) => api.put(`/professeurs/${id}`, data),
  delete: (id) => api.delete(`/professeurs/${id}`)
};

// Student Services
export const studentService = {
  getAll: () => api.get('/etudiants'),
  getById: (id) => api.get(`/etudiants/${id}`),
  getActivated: () => api.get('/etudiants/activated'),
  getPending: () => api.get('/etudiants/pending'),
  create: (data) => api.post('/registerStudent', data),
  update: (id, data) => api.put(`/etudiants/${id}`, data),
  delete: (id) => api.delete(`/etudiants/${id}`),
  activate: (id) => api.put(`/etudiants/${id}/activate`),
  deactivate: (id) => api.put(`/etudiants/${id}/deactivate`)
};

// Domain Services
export const domainService = {
  getAll: () => api.get('/domaines'),
  getById: (id) => api.get(`/domaines/${id}`),
  create: (data) => api.post('/domaines', data),
  update: (id, data) => api.put(`/domaines/${id}`, data),
  delete: (id) => api.delete(`/domaines/${id}`)
};

// Prerequisite Services
export const prerequisiteService = {
  getAll: () => api.get('/prerequis'),
  getByFiliere: (filiereId) => api.get(`/prerequis/filiere/${filiereId}`),
  create: (data) => api.post('/prerequis', data),
  update: (id, data) => api.put(`/prerequis/${id}`, data),
  delete: (id) => api.delete(`/prerequis/${id}`)
};

// Filiere Services
export const filiereService = {
  getAll: () => api.get('/filiere'),
  getById: (id) => api.get(`/filiere/${id}`),
  create: (data) => api.post('/filiere', data),
  update: (id, data) => api.put(`/filiere/${id}`, data),
  delete: (id) => api.delete(`/filiere/${id}`)
};

// Demande Services
export const demandeService = {
  getAll: () => api.get('/demandes'),
  getByProfessor: (profId) => api.get(`/demandes/prof/${profId}`),
  getByStudent: (studentId) => api.get(`/demandes/student/${studentId}`),
  create: (data) => api.post('/demandes', data),
  approve: (id) => api.put(`/demandes/${id}/approve`),
  reject: (id) => api.put(`/demandes/${id}/reject`),
  delete: (id) => api.delete(`/demandes/${id}`)
};

// Postulation Services (Student applications)
export const postulationService = {
  getByStudent: (studentId) => api.get(`/postulations/student/${studentId}`),
  getByPfe: (pfeId) => api.get(`/postulations/pfe/${pfeId}`),
  create: (data) => api.post('/postulations', data),
  accept: (id) => api.put(`/postulations/${id}/accept`),
  reject: (id) => api.put(`/postulations/${id}/reject`),
  cancel: (id) => api.delete(`/postulations/${id}`)
};

// Dashboard Statistics
export const statsService = {
  getDashboard: () => api.get('/stats/dashboard'),
  getPfeStats: () => api.get('/stats/pfe'),
  getStudentStats: () => api.get('/stats/students'),
  getProfessorStats: () => api.get('/stats/professors')
};

export default api;
