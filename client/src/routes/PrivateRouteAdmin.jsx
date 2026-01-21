import { Outlet, Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';

// Admin route (role === 3)
const PrivateRouteAdmin = () => {
  const auth = Cookies.get('auth');
  const role = Cookies.get('role');

  if (!auth) {
    return <Navigate to="/login" replace />;
  }

  if (role !== '3') {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default PrivateRouteAdmin;
