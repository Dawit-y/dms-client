import Login from '../pages/auth/Login';
import Dashboard from '../pages/dashboard';
import PaymentDetails from '../pages/project_payment/PaymentDetails';
import Projects from '../pages/projects';
import AddProject from '../pages/projects/AddProject';
import EditProject from '../pages/projects/EditProject';
import ProjectDetails from '../pages/projects/ProjectDetails';
import Users from '../pages/users';
import AddUser from '../pages/users/AddUser';
import EditUser from '../pages/users/EditUser';
import UserDetails from '../pages/users/UserDetails';

const authProtectedRoutes = [
  { path: '/users', element: <Users /> },
  { path: '/users/add', element: <AddUser /> },
  { path: '/users/:id', element: <UserDetails /> },
  { path: '/users/:id/edit', element: <EditUser /> },

  { path: '/projects', element: <Projects /> },
  { path: '/projects/add', element: <AddProject /> },
  { path: '/projects/:id/:tab?', element: <ProjectDetails /> },
  { path: '/projects/:id/edit', element: <EditProject /> },

  {
    path: '/projects/:projectId/payments/:paymentId',
    element: <PaymentDetails />,
  },

  { path: '/dashboard', element: <Dashboard /> },
  { path: '/', element: <Dashboard /> },
];

const publicRoutes = [{ path: '/login', element: <Login /> }];

export { authProtectedRoutes, publicRoutes };
