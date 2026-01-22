import { Outlet, Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';

// General authenticated route (any logged-in user)
const PrivateRouteAuth = () => {
  const auth = Cookies.get('auth');

  if (!auth) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default PrivateRouteAuth;
