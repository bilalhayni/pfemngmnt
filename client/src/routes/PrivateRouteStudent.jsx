import { Outlet, Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';

// Student route (role === 2)
const PrivateRouteStudent = () => {
  const auth = Cookies.get('auth');
  const role = Cookies.get('role');

  if (!auth) {
    return <Navigate to="/login" replace />;
  }

  if (role !== '2') {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default PrivateRouteStudent;
