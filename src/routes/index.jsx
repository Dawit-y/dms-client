import Login from '../pages/auth/Login';
import Dashboard from '../pages/dashboard';
import Projects from '../pages/projects';
import Users from '../pages/users';

const authProtectedRoutes = [
  { path: '/users', element: <Users /> },
  { path: '/projects', element: <Projects /> },
  { path: '/dashboard', element: <Dashboard /> },
  { path: '/', element: <Dashboard /> },
];

const publicRoutes = [{ path: '/login', element: <Login /> }];

export { authProtectedRoutes, publicRoutes };
