/**
 * Legacy API exports - For backward compatibility
 *
 * This file re-exports from the new modular structure.
 * New code should import from './api/index.js' directly.
 *
 * @deprecated Import from './api' instead
 */

// Import everything from the api module
import apiClient, {
  authService,
  pfeService,
  professorService,
  professorPortalService,
  studentService,
  domainService,
  prerequisiteService,
  filiereService,
  demandeService,
  postulationService,
  statsService,
  adminService,
  chefDepartementService
} from './api';

// Re-export everything
export {
  authService,
  pfeService,
  professorService,
  professorPortalService,
  studentService,
  domainService,
  prerequisiteService,
  filiereService,
  demandeService,
  postulationService,
  statsService,
  adminService,
  chefDepartementService
};

// Default export is the API client
export default apiClient;
