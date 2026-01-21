// User Roles
export const ROLES = {
  PROFESSOR: 0,
  CHEF_DEPARTEMENT: 1,
  STUDENT: 2,
  ADMIN: 3
};

export const ROLE_NAMES = {
  [ROLES.PROFESSOR]: 'Professeur',
  [ROLES.CHEF_DEPARTEMENT]: 'Chef de Département',
  [ROLES.STUDENT]: 'Étudiant',
  [ROLES.ADMIN]: 'Administrateur'
};

// PFE Status
export const PFE_STATUS = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
};

export const PFE_STATUS_LABELS = {
  [PFE_STATUS.PENDING]: 'En attente',
  [PFE_STATUS.IN_PROGRESS]: 'En cours',
  [PFE_STATUS.COMPLETED]: 'Terminé',
  [PFE_STATUS.CANCELLED]: 'Annulé'
};

// Demande Status
export const DEMANDE_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected'
};

export const DEMANDE_STATUS_LABELS = {
  [DEMANDE_STATUS.PENDING]: 'En attente',
  [DEMANDE_STATUS.APPROVED]: 'Approuvée',
  [DEMANDE_STATUS.REJECTED]: 'Rejetée'
};

// Priority Levels
export const PRIORITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high'
};

export const PRIORITY_LABELS = {
  [PRIORITY.LOW]: 'Basse',
  [PRIORITY.MEDIUM]: 'Moyenne',
  [PRIORITY.HIGH]: 'Haute'
};

// API Base URL
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

// Pagination
export const DEFAULT_PAGE_SIZE = 10;
export const PAGE_SIZE_OPTIONS = [5, 10, 20, 50];
