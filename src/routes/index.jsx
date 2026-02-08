import Login from '../pages/auth/Login';
import Dashboard from '../pages/dashboard';
import Projects from '../pages/projects';
import AddProject from '../pages/projects/AddProject';
import EditProject from '../pages/projects/EditProject';
import ProjectDetails from '../pages/projects/ProjectDetails';
import Users from '../pages/users';

const authProtectedRoutes = [
  { path: '/users', element: <Users /> },

  { path: '/projects', element: <Projects /> },
  { path: '/projects/add', element: <AddProject /> },
  { path: '/projects/:id', element: <ProjectDetails /> },
  { path: '/projects/:id/edit', element: <EditProject /> },

  { path: '/dashboard', element: <Dashboard /> },
  { path: '/', element: <Dashboard /> },
];

const publicRoutes = [{ path: '/login', element: <Login /> }];

export { authProtectedRoutes, publicRoutes };
