const menuItems = [
  {
    title: 'Dashboard',
    icon: 'mdi mdi-view-dashboard',
    submenu: [
      { name: 'Home', path: '/dashboard' },
      { name: 'Analytics', path: '/analytics' },
    ],
  },
  {
    title: 'Projects',
    icon: 'mdi mdi-briefcase-outline',
    submenu: [{ name: 'Projects', path: '/projects' }],
  },
  {
    title: 'Users',
    icon: 'mdi mdi-account-group-outline',
    submenu: [{ name: 'All Users', path: '/users' }],
  },
];

export { menuItems };
