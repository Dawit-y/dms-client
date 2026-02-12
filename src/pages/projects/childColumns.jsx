import ActionsCell from '../../components/Common/ActionsCell';
import { snColumn } from '../../components/Common/TableContainer/snColumnDef';

export const useChildProjectColumns = (
  onEdit,
  onDelete,
  handleCanvasToggle,
  hasPermission
) => {
  return [
    snColumn,
    {
      accessorKey: 'title',
      header: 'Title',
    },
    {
      accessorKey: 'budget',
      header: 'Budget',
      cell: (info) => {
        const value = info.getValue();
        return value ? `$${Number(value).toLocaleString()}` : '-';
      },
      meta: {
        filterVariant: 'range',
      },
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: (info) => {
        const value = info.getValue();
        return value || '-';
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: (info) => (
        <ActionsCell
          id={info.row.original.id}
          onCanvasToggle={() => handleCanvasToggle(info.row.original)}
          onEdit={
            hasPermission('accounts.change_project')
              ? () => onEdit(info.row.original)
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
