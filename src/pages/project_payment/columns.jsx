import { useNavigate } from 'react-router';

import ActionsCell from '../../components/Common/ActionsCell';
import { snColumn } from '../../components/Common/TableContainer/snColumnDef';

export const usePaymentColumns = (
  projectId,
  onEdit,
  onDelete,
  handleCanvasToggle,
  hasPermission
) => {
  const navigate = useNavigate();

  return [
    snColumn,
    {
      accessorKey: 'amount',
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
      cell: (info) => {
        const value = info.getValue();
        return value ? new Date(value).toLocaleDateString() : '-';
      },
    },
    {
      accessorKey: 'payment_method',
      cell: (info) => {
        const value = info.getValue();
        return value || '-';
      },
    },
    {
      accessorKey: 'status',
      cell: (info) => {
        const value = info.getValue();
        return value || '-';
      },
    },
    {
      accessorKey: 'receipt_number',
      cell: (info) => info.getValue() || '-',
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: (info) => (
        <ActionsCell
          id={info.row.original.id}
          onCanvasToggle={() => handleCanvasToggle(info.row.original)}
          onView={(id) => navigate(`/projects/${projectId}/payments/${id}`)}
          onEdit={
            hasPermission('accounts.change_projectpayment')
              ? () => onEdit(info.row.original)
              : undefined
          }
          onDelete={
            hasPermission('accounts.delete_projectpayment')
              ? () => onDelete(info.row.original)
              : undefined
          }
        />
      ),
    },
  ];
};
