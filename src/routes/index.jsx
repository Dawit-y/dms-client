import Documents from '../pages/documents';
import Login from '../pages/auth/Login';
import Dashboard from '../pages/dashboard';
import Logout from '../pages/auth/Logout';
import Users from '../pages/users';

const authProtectedRoutes = [
  { path: '/documents', element: <Documents /> },
  { path: '/users', element: <Users /> },
  { path: '/dashboard', element: <Dashboard /> },
  { path: '/', element: <Dashboard /> },
];

const publicRoutes = [
  { path: '/login', element: <Login /> },
  { path: '/logout', element: <Logout /> },
];

export { authProtectedRoutes, publicRoutes };
