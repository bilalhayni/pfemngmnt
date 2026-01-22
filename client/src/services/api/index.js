/**
 * API Services - Centralized exports
 *
 * This module provides a clean interface for all API services.
 * Import services from here rather than individual files.
 */

// API Client
export { default as apiClient, clearAuthCookies } from './client';

// Auth Service
export { default as authService } from './auth.service';

// Entity Services
export { default as pfeService } from './pfe.service';
export { default as professorService, professorPortalService } from './professor.service';
export { default as studentService } from './student.service';
export { default as domainService, prerequisiteService } from './domain.service';
export { default as filiereService } from './filiere.service';
export { default as demandeService, postulationService } from './demande.service';
export { default as statsService } from './stats.service';

// Role-specific Services
export { default as adminService } from './admin.service';
export { default as chefDepartementService } from './chef-departement.service';
