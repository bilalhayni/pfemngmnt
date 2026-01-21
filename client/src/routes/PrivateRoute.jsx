import { Outlet, Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';

// Chef Département route (role === 1)
const PrivateRoute = () => {
  const auth = Cookies.get('auth');
  const role = Cookies.get('role');

  if (!auth) {
    return <Navigate to="/login" replace />;
  }

  if (role !== '1') {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;
