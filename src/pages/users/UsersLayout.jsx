import { Outlet } from 'react-router';

import { usePageFilters } from '../../hooks/usePageFilters';

const searchConfig = {
  textSearchKeys: ['first_name', 'last_name', 'email'],
  dropdownSearchKeys: [],
  dateSearchKeys: [],
};

export default function UsersLayout() {
  const pageFilter = usePageFilters(searchConfig);

  return <Outlet context={{ pageFilter, searchConfig }} />;
}
