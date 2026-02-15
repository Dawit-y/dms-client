import { useNavigate } from 'react-router';

import ActionsCell from '../../components/Common/ActionsCell';
import { snColumn } from '../../components/Common/TableContainer/snColumnDef';

export const useUserColumns = (onDelete, hasPermission, onDuplicate) => {
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
          onDuplicate={
            hasPermission('accounts.add_user')
              ? () => onDuplicate(info.row.original)
              : undefined
          }
          onEdit={
            hasPermission('accounts.change_user')
              ? (id) => navigate(`/users/${id}/edit${window.location.search}`)
              : undefined
          }
          onDelete={
            hasPermission('accounts.delete_user')
              ? () => onDelete(info.row.original)
              : undefined
          }
        />
      ),
    },
  ];
};
