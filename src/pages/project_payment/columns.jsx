import { FaEye } from 'react-icons/fa';

import IconButton from '../../components/Common/IconButton';
import { snColumn } from '../../components/Common/TableContainer/snColumnDef';

export const paymentColumns = (navigate, projectId) => [
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
      <IconButton
        icon={<FaEye />}
        onClick={() =>
          navigate(`/projects/${projectId}/payments/${info.row.original.id}`)
        }
      />
    ),
  },
];
