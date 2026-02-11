import { useNavigate } from 'react-router';

import ActionsCell from '../../components/Common/ActionsCell';
import { snColumn } from '../../components/Common/TableContainer/snColumnDef';

export const usePaymentColumns = (
  projectId,
  onEdit,
  onDelete,
  hasPermission
) => {
  const navigate = useNavigate();

  return [
    snColumn,
    {
      accessorKey: 'amount',
      header: 'Amount',
      cell: (info) => {
        const value = info.getValue();
        return value ? `$${Number(value).toLocaleString()}` : '-';
      },
      meta: {
        filterVariant: 'range',
      },
    },
    {
      accessorKey: 'payment_date',
      header: 'Payment Date',
      cell: (info) => {
        const value = info.getValue();
        return value ? new Date(value).toLocaleDateString() : '-';
      },
    },
    {
      accessorKey: 'payment_method',
      header: 'Payment Method',
      cell: (info) => {
        const value = info.getValue();
        return value || '-';
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
      accessorKey: 'receipt_number',
      header: 'Receipt Number',
      cell: (info) => info.getValue() || '-',
    },
    {
      header: 'Actions',
      id: 'actions',
      cell: (info) => (
        <ActionsCell
          id={info.row.original.id}
          onView={(id) => navigate(`/projects/${projectId}/payments/${id}`)}
          onEdit={
            hasPermission('accounts.change_projectpayment')
              ? () => onEdit(info.row.original)
              : undefined
          }
          onDelete={
            hasPermission('accounts.delete_projectpayment')
              ? () => onDelete(info.row.original.id)
              : undefined
          }
        />
      ),
    },
  ];
};
