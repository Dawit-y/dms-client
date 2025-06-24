import Documents from '../pages/documents';
import Login from '../pages/auth/Login';
import Dashboard from '../pages/dashboard';

const authProtectedRoutes = [
  { path: '/documents', element: <Documents /> },
  { path: '/Projects', element: <Documents /> },
  { path: '/dashboard', element: <Dashboard /> },
  { path: '/', element: <Dashboard /> },
];

const publicRoutes = [{ path: '/login', element: <Login /> }];

export { authProtectedRoutes, publicRoutes };
