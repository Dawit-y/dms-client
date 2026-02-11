// routes/index.tsx
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

export const authProtectedRoutes = [
  {
    path: '/users',
    element: <UsersLayout />,
    permission: 'accounts.view_user',
    children: [
      { index: true, element: <Users /> },
      {
        path: 'add',
        element: <AddUser />,
        permission: 'accounts.add_user',
      },
      { path: ':id', element: <UserDetails /> },
      {
        path: ':id/edit',
        element: <EditUser />,
        permission: 'accounts.change_user',
      },
    ],
  },
  {
    path: '/projects',
    element: <ProjectsLayout />,
    permission: 'accounts.view_project',
    children: [
      { index: true, element: <Projects /> },
      {
        path: 'add',
        element: <AddProject />,
        permission: 'accounts.add_project',
      },
      { path: ':id/:tab?', element: <ProjectDetails /> },
      {
        path: ':id/edit',
        element: <EditProject />,
        permission: 'accounts.change_project',
      },
      {
        path: ':projectId/payments/:paymentId',
        element: <PaymentDetails />,
        permission: 'accounts.view_projectpayment',
      },
    ],
  },
  {
    path: '/dashboard',
    element: <Dashboard />,
  },
  {
    path: '/',
    element: <Dashboard />,
  },
];

export const publicRoutes = [{ path: '/login', element: <Login /> }];
