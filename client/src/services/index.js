/**
 * Services - Centralized exports
 *
 * Import all services from this module for clean imports:
 * import { authService, pfeService } from '../services';
 */

// Re-export everything from the api module
export * from './api';

// Default export is the API client
export { apiClient as default } from './api';
