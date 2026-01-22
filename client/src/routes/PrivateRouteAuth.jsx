import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loading } from '../components/common';

/**
 * Protected route for any authenticated user (any role)
 * Uses AuthContext instead of accessing cookies directly
 */
const PrivateRouteAuth = () => {
  const { user, loading, isAuthenticated } = useAuth();

  // Show loading spinner while checking auth
  if (loading) {
    return <Loading fullPage message="Vérification de l'authentification..." />;
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default PrivateRouteAuth;
