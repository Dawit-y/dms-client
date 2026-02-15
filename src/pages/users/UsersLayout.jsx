import { Outlet } from 'react-router';

import { usePageFilters } from '../../hooks/usePageFilters';

const searchConfig = {
  textSearchKeys: ['name'],
  dropdownSearchKeys: [
    {
      key: 'status',
      options: {
        inactive: 'Inactive',
        active: 'Active',
        completed: 'Completed',
      },
    },
  ],
  dateSearchKeys: ['created_at'],
};

export default function UsersLayout() {
  const pageFilter = usePageFilters(searchConfig);

  return <Outlet context={{ pageFilter, searchConfig }} />;
}
