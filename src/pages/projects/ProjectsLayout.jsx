import { Outlet } from 'react-router';

import { usePageFilters } from '../../hooks/usePageFilters';

const searchConfig = {
  textSearchKeys: ['title'],
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
  dateSearchKeys: ['created'],
};

export default function ProjectsLayout() {
  const pageFilter = usePageFilters(searchConfig);

  return <Outlet context={{ pageFilter, searchConfig }} />;
}
