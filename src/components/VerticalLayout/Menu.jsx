const menuItems = [
  {
    title: 'Dashboard',
    icon: 'mdi mdi-view-dashboard',
    submenu: [
      { name: 'Home', path: '/home' },
      { name: 'Analytics', path: '/analytics' },
    ],
  },
  {
    title: 'Documents',
    icon: 'mdi mdi-briefcase-outline',
    submenu: [
      { name: 'All Documents', path: '/documents' },
      { name: 'Create Document', path: '/documents/create' },
    ],
  },
  {
    title: 'Users',
    icon: 'mdi mdi-account-group-outline',
    submenu: [
      { name: 'All Users', path: '/users' },
      { name: 'Add User', path: '/users/add' },
    ],
  },
];

export { menuItems };
