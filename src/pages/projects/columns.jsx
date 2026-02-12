import { useNavigate } from 'react-router';

import ActionsCell from '../../components/Common/ActionsCell';
import { snColumn } from '../../components/Common/TableContainer/snColumnDef';

export const useProjectColumns = (onDelete, hasPermission) => {
  const navigate = useNavigate();

  return [
    snColumn,
    {
      accessorKey: 'title',
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: 'budget',
      cell: (info) => info.getValue(),
      meta: {
        filterVariant: 'range',
      },
    },
    {
      accessorKey: 'status',
      cell: (info) => info.getValue(),
    },
    {
      header: 'Actions',
      id: 'actions',
      size: 100,
      cell: (info) => (
        <ActionsCell
          id={info.row.original.id}
          onView={(id) => navigate(`/projects/${id}${window.location.search}`)}
          onEdit={
            hasPermission('accounts.change_project')
              ? (id) =>
                  navigate(`/projects/${id}/edit${window.location.search}`)
              : undefined
          }
          onDelete={
            hasPermission('accounts.delete_project')
              ? () => onDelete(info.row.original)
              : undefined
          }
        />
      ),
    },
  ];
};
