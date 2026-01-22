/**
 * Legacy API exports - For backward compatibility
 *
 * This file re-exports from the new modular structure.
 * New code should import from './api/index.js' directly.
 *
 * @deprecated Import from './api' instead
 */

export {
  apiClient as default,
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
