import ActionsCell from '../../components/Common/ActionsCell';
import { snColumn } from '../../components/Common/TableContainer/snColumnDef';

export const usePaymentItemColumns = (onEdit, onDelete, hasPermission) => {
  return [
    snColumn,
    {
      accessorKey: 'name',
      cell: (info) => info.getValue() || '-',
    },
    {
      accessorKey: 'quantity',
      cell: (info) => info.getValue() || '-',
    },
    {
      accessorKey: 'unit_price',
      cell: (info) => {
        const value = info.getValue();
        return value ? `$${Number(value).toLocaleString()}` : '-';
      },
    },
    {
      accessorKey: 'total',
      cell: (info) => {
        const value = info.getValue();
        return value ? `$${Number(value).toLocaleString()}` : '-';
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: (info) => (
        <ActionsCell
          id={info.row.original.id}
          onEdit={
            hasPermission('accounts.change_paymentitem')
              ? () => onEdit(info.row.original)
              : undefined
          }
          onDelete={
            hasPermission('accounts.delete_paymentitem')
              ? () => onDelete(info.row.original.id)
              : undefined
          }
        />
      ),
    },
  ];
};
