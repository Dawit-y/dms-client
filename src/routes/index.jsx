import Login from '../pages/auth/Login';
import Dashboard from '../pages/dashboard';
import PaymentDetails from '../pages/project_payment/PaymentDetails';
import Projects from '../pages/projects';
import AddProject from '../pages/projects/AddProject';
import EditProject from '../pages/projects/EditProject';
import ProjectDetails from '../pages/projects/ProjectDetails';
import ProjectsLayout from '../pages/projects/ProjectsLayout';
import Users from '../pages/users';
import AddUser from '../pages/users/AddUser';
import EditUser from '../pages/users/EditUser';
import UserDetails from '../pages/users/UserDetails';
import UsersLayout from '../pages/users/UsersLayout';

const authProtectedRoutes = [
  {
    path: '/users',
    element: <UsersLayout />,
    children: [
      { index: true, element: <Users /> },
      { path: 'add', element: <AddUser /> },
      { path: ':id', element: <UserDetails /> },
      { path: ':id/edit', element: <EditUser /> },
    ],
  },

  {
    path: '/projects',
    element: <ProjectsLayout />,
    children: [
      { index: true, element: <Projects /> },
      { path: 'add', element: <AddProject /> },
      { path: ':id/:tab?', element: <ProjectDetails /> },
      { path: ':id/edit', element: <EditProject /> },
      {
        path: ':projectId/payments/:paymentId',
        element: <PaymentDetails />,
      },
    ],
  },

  { path: '/dashboard', element: <Dashboard /> },
  { path: '/', element: <Dashboard /> },
];

const publicRoutes = [{ path: '/login', element: <Login /> }];

export { authProtectedRoutes, publicRoutes };
