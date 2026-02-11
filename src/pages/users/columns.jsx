import { useNavigate } from 'react-router';

import ActionsCell from '../../components/Common/ActionsCell';
import { snColumn } from '../../components/Common/TableContainer/snColumnDef';

export const useUserColumns = (onDelete, hasPermission) => {
  const navigate = useNavigate();

  return [
    snColumn,
    {
      accessorKey: 'first_name',
      header: 'First Name',
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: 'last_name',
      header: 'Last Name',
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: 'email',
      header: 'Email',
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: 'phone_number',
      header: 'Phone Number',
      cell: (info) => info.getValue(),
    },
    {
      header: 'Actions',
      id: 'actions',
      size: 100,
      cell: (info) => (
        <ActionsCell
          id={info.row.original.id}
          onView={(id) => navigate(`/users/${id}${window.location.search}`)}
          onEdit={
            hasPermission('accounts.change_user')
              ? (id) => navigate(`/users/${id}/edit${window.location.search}`)
              : undefined
          }
          onDelete={
            hasPermission('accounts.delete_user') ? onDelete : undefined
          }
        />
      ),
    },
  ];
};
