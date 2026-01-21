import { Outlet, Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';

// Professor route (role === 0)
const PrivateRouteProf = () => {
  const auth = Cookies.get('auth');
  const role = Cookies.get('role');

  if (!auth) {
    return <Navigate to="/login" replace />;
  }

  if (role !== '0') {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default PrivateRouteProf;
