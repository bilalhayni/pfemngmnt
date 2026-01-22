import { Outlet, Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useAuth } from '../context/AuthContext';
import { Loading } from '../components/common';

/**
 * Unified Protected Route Component
 * Handles authentication and role-based authorization for all user types
 *
 * @param {number|number[]|null} allowedRoles - Role(s) allowed to access the route
 *   - null/undefined: Any authenticated user can access
 *   - number: Single role allowed (e.g., ROLES.ADMIN)
 *   - number[]: Multiple roles allowed (e.g., [ROLES.ADMIN, ROLES.PROFESSOR])
 * @param {string} redirectTo - Path to redirect unauthorized users (default: '/login')
 */
const PrivateRoute = ({ allowedRoles = null, redirectTo = '/login' }) => {
  const { loading, isAuthenticated, hasRole, ROLES } = useAuth();

  // Show loading spinner while checking auth
  if (loading) {
    return <Loading fullPage message="Vérification de l'authentification..." />;
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated()) {
    return <Navigate to={redirectTo} replace />;
  }

  // If no specific roles required, allow any authenticated user
  if (allowedRoles === null || allowedRoles === undefined) {
    return <Outlet />;
  }

  // Check role authorization
  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
  const hasRequiredRole = roles.some(role => hasRole(role));

  if (!hasRequiredRole) {
    return <Navigate to={redirectTo} replace />;
  }

  return <Outlet />;
};

PrivateRoute.propTypes = {
  allowedRoles: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.arrayOf(PropTypes.number)
  ]),
  redirectTo: PropTypes.string
};

export default PrivateRoute;
