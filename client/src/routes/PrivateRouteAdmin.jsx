import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loading } from '../components/common';

/**
 * Protected route for Admin (role === 3)
 * Uses AuthContext instead of accessing cookies directly
 */
const PrivateRouteAdmin = () => {
  const { user, loading, isAuthenticated, hasRole, ROLES } = useAuth();

  // Show loading spinner while checking auth
  if (loading) {
    return <Loading fullPage message="Vérification de l'authentification..." />;
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  // Redirect to login if user doesn't have Admin role
  if (!hasRole(ROLES.ADMIN)) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default PrivateRouteAdmin;
