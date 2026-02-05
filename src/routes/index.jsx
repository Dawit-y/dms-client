import Login from '../pages/auth/Login';
import Dashboard from '../pages/dashboard';
import Documents from '../pages/documents';
import Projects from '../pages/projects';
import ProjectsList from '../pages/projects/ProjectsList';
import Users from '../pages/users';

const authProtectedRoutes = [
  { path: '/documents', element: <Documents /> },
  { path: '/users', element: <Users /> },
  { path: '/projects', element: <Projects /> },
  { path: '/projects/list', element: <ProjectsList /> },
  { path: '/dashboard', element: <Dashboard /> },
  { path: '/', element: <Dashboard /> },
];

const publicRoutes = [{ path: '/login', element: <Login /> }];

export { authProtectedRoutes, publicRoutes };
