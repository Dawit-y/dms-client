import Login from '../pages/auth/Login';
import Logout from '../pages/auth/Logout';
import Dashboard from '../pages/dashboard';
import Documents from '../pages/documents';
import Projects from '../pages/projects';
import Users from '../pages/users';

const authProtectedRoutes = [
  { path: '/documents', element: <Documents /> },
  { path: '/users', element: <Users /> },
  { path: '/projects', element: <Projects /> },
  { path: '/dashboard', element: <Dashboard /> },
  { path: '/', element: <Dashboard /> },
];

const publicRoutes = [
  { path: '/login', element: <Login /> },
  { path: '/logout', element: <Logout /> },
];

export { authProtectedRoutes, publicRoutes };
