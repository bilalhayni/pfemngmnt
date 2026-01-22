import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loading } from '../components/common';

/**
 * Protected route for Chef Département (role === 1)
 * Uses AuthContext instead of accessing cookies directly
 */
const PrivateRoute = () => {
  const { user, loading, isAuthenticated, hasRole, ROLES } = useAuth();

  // Show loading spinner while checking auth
  if (loading) {
    return <Loading fullPage message="Vérification de l'authentification..." />;
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  // Redirect to login if user doesn't have Chef Département role
  if (!hasRole(ROLES.CHEF_DEPARTEMENT)) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;
